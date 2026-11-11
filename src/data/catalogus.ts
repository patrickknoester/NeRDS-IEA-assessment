import { parse } from 'yaml';
import { z } from 'zod';
import { kaderSchema, type Kader, type KaderId } from '../model/kader.ts';
import { aspectSchema, themaSchema, type Aspect, type Thema } from '../model/aspect.ts';
import { hulpmiddelenBestandSchema, type Hulpmiddel } from '../model/hulpmiddel.ts';
import { beslisboomSchema, type Beslisboom } from '../model/beslisboom.ts';

/** Alle inhoud uit data/: kaders, thema's, aspecten (de crosswalk) en hulpmiddelen. */
export interface Catalogus {
  kaders: Map<KaderId, Kader>;
  themas: Thema[];
  aspecten: Aspect[];
  hulpmiddelen: Hulpmiddel[];
  beslisboom: Beslisboom | undefined;
}

export interface Fout {
  bestand: string;
  melding: string;
}

const themasBestandSchema = z.object({ themas: z.array(themaSchema) });
const aspectenBestandSchema = z.object({ aspecten: z.array(aspectSchema) });

function zodFouten(bestand: string, fout: z.ZodError): Fout[] {
  return fout.issues.map((i) => ({ bestand, melding: `${i.path.join('.') || '(root)'}: ${i.message}` }));
}

/**
 * Leest de YAML-bestanden (pad → inhoud), valideert elk bestand tegen zijn schema en
 * controleert daarna alle verwijzingen tussen de bestanden.
 * Geeft altijd een catalogus terug, met de fouten ernaast.
 */
export function bouwCatalogus(bestanden: Record<string, string>): { catalogus: Catalogus; fouten: Fout[] } {
  const fouten: Fout[] = [];
  const catalogus: Catalogus = { kaders: new Map(), themas: [], aspecten: [], hulpmiddelen: [], beslisboom: undefined };
  const herkomst = new Map<object, string>();

  for (const [pad, inhoud] of Object.entries(bestanden).sort(([a], [b]) => a.localeCompare(b))) {
    const bestand = pad.slice(pad.indexOf('data/'));
    let data: unknown;
    try {
      data = parse(inhoud);
    } catch (e) {
      fouten.push({ bestand, melding: `geen geldige YAML: ${(e as Error).message}` });
      continue;
    }

    const lees = <T>(schema: z.ZodType<T>, gebruik: (waarde: T) => void) => {
      const r = schema.safeParse(data);
      if (r.success) gebruik(r.data);
      else fouten.push(...zodFouten(bestand, r.error));
    };

    if (/^data\/kaders\/[^/]+\.yaml$/.test(bestand)) {
      lees(kaderSchema, (k) => {
        if (catalogus.kaders.has(k.id)) fouten.push({ bestand, melding: `kader ${k.id} staat in meer dan één bestand` });
        catalogus.kaders.set(k.id, k);
        herkomst.set(k, bestand);
      });
    } else if (bestand === 'data/themas.yaml') {
      lees(themasBestandSchema, (t) => catalogus.themas.push(...t.themas));
    } else if (/^data\/aspecten\/[^/]+\.yaml$/.test(bestand)) {
      lees(aspectenBestandSchema, (a) =>
        a.aspecten.forEach((aspect) => {
          catalogus.aspecten.push(aspect);
          herkomst.set(aspect, bestand);
        }),
      );
    } else if (/^data\/hulpmiddelen\/[^/]+\.yaml$/.test(bestand)) {
      lees(hulpmiddelenBestandSchema, (h) =>
        h.hulpmiddelen.forEach((hm) => {
          catalogus.hulpmiddelen.push(hm);
          herkomst.set(hm, bestand);
        }),
      );
    } else if (bestand === 'data/iea/beslisboom.yaml') {
      lees(beslisboomSchema, (b) => (catalogus.beslisboom = b));
    } else {
      fouten.push({ bestand, melding: 'onbekend bestand: past niet in de mappenstructuur van data/' });
    }
  }

  fouten.push(...controleerVerwijzingen(catalogus, (o) => herkomst.get(o) ?? 'data/'));
  catalogus.themas.sort((a, b) => a.volgorde - b.volgorde);
  return { catalogus, fouten };
}

function controleerVerwijzingen(c: Catalogus, bestandVan: (o: object) => string): Fout[] {
  const fouten: Fout[] = [];
  const dubbel = <T>(items: T[], sleutel: (t: T) => string) => {
    const gezien = new Set<string>();
    return items.filter((i) => (gezien.has(sleutel(i)) ? true : (gezien.add(sleutel(i)), false)));
  };

  for (const kader of c.kaders.values()) {
    const bestand = bestandVan(kader);
    const ids = new Set(kader.onderdelen.map((o) => o.id));
    for (const o of dubbel(kader.onderdelen, (o) => o.id)) fouten.push({ bestand, melding: `onderdeel-ID ${o.id} komt dubbel voor` });
    for (const o of kader.onderdelen) {
      if (o.ouder && !ids.has(o.ouder)) fouten.push({ bestand, melding: `${o.id}: ouder ${o.ouder} bestaat niet` });
      for (const r of o.relaties) if (!ids.has(r)) fouten.push({ bestand, melding: `${o.id}: relatie ${r} bestaat niet` });
    }
  }

  const bestaat = (kader: string, onderdeel: string) =>
    c.kaders.get(kader as KaderId)?.onderdelen.some((o) => o.id === onderdeel) ?? false;

  const themaIds = new Set(c.themas.map((t) => t.id));
  for (const t of dubbel(c.themas, (t) => t.id)) fouten.push({ bestand: 'data/themas.yaml', melding: `thema ${t.id} komt dubbel voor` });
  for (const a of dubbel(c.aspecten, (a) => a.id)) fouten.push({ bestand: bestandVan(a), melding: `aspect ${a.id} komt dubbel voor` });

  for (const aspect of c.aspecten) {
    const bestand = bestandVan(aspect);
    if (!themaIds.has(aspect.thema)) fouten.push({ bestand, melding: `${aspect.id}: thema ${aspect.thema} bestaat niet` });
    for (const [kader, onderdelen] of Object.entries(aspect.koppelingen)) {
      if (!c.kaders.has(kader as KaderId)) {
        fouten.push({ bestand, melding: `${aspect.id}: kader ${kader} is niet geladen` });
        continue;
      }
      for (const { id } of onderdelen ?? [])
        if (!bestaat(kader, id)) fouten.push({ bestand, melding: `${aspect.id}: ${kader}:${id} bestaat niet` });
    }
  }

  for (const h of c.hulpmiddelen) {
    for (const ref of h.onderdelen) {
      const [kader, ...rest] = ref.split(':');
      if (!bestaat(kader, rest.join(':')))
        fouten.push({ bestand: bestandVan(h), melding: `${h.id}: verwijzing ${ref} bestaat niet` });
    }
  }
  return fouten;
}

/** De kaderversies die nu geladen zijn, om in een nieuw assessment vast te leggen. */
export function kaderVersies(c: Catalogus): Partial<Record<KaderId, string>> {
  return Object.fromEntries([...c.kaders.values()].map((k) => [k.id, k.versie]));
}
