import type { Catalogus } from '../data/catalogus.ts';
import type { Aspect, Thema } from './aspect.ts';
import { eifLagen, type AspectAntwoord, type Assessment, type EifLaag } from './assessment.ts';
import { beoordeelVerplichting, type BeslisboomUitkomst } from './beslisboom.ts';
import { kaderIds, type KaderId } from './kader.ts';
import { aspectStatus, dekkingPerKader, zichtbareAspecten, type AspectStatus, type OnderdeelDekking } from './voortgang.ts';

/** Een link alleen als het een echte http(s)-URL is; anders tonen we de tekst. */
export function geldigeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : undefined;
  } catch {
    return undefined;
  }
}

export interface RapportOpties {
  /** Openbare versie: laat alles weg wat als gevoelig is gemarkeerd. */
  openbaar: boolean;
}

export interface RapportRisico {
  aspect: string;
  omschrijving: string;
  eigenaar?: string;
}

export interface RapportAspect {
  aspect: Aspect;
  status: AspectStatus;
  antwoord: AspectAntwoord | undefined;
  risicos: AspectAntwoord['risicos'];
  koppelingen: { kader: string; titel: string; bron: string }[];
}

export interface KaderDekking {
  kader: KaderId;
  naam: string;
  afkorting: string;
  versie: string;
  rijen: OnderdeelDekking[];
  behandeld: number;
  nvt: number;
  open: number;
}

export interface Rapport {
  titel: string;
  opgesteld: string;
  openbaar: boolean;
  /** Aantal gevoelige onderdelen dat in deze versie is weggelaten. */
  weggelaten: number;
  samenvatting: {
    keuzes: { aspect: string; keuze: string }[];
    openAspecten: string[];
    risicos: RapportRisico[];
    dekking: KaderDekking[];
  };
  context: Assessment['context'];
  themas: { thema: Thema; aspecten: RapportAspect[] }[];
  dekking: KaderDekking[];
  iea:
    | {
        verplichting: BeslisboomUitkomst | undefined;
        data: NonNullable<Assessment['iea']>;
      }
    | undefined;
  verantwoording: {
    kaderVersies: { afkorting: string; naam: string; versie: string; huidigeVersie: string | undefined; bron: string }[];
    aangemaakt: string;
    gewijzigd: string;
    betrokkenen: Assessment['context']['betrokkenen'];
    assessmentId: string;
  };
}

const leeg = (s: string | undefined) => !s || !s.trim();

export function bouwRapport(c: Catalogus, a: Assessment, o: RapportOpties, nu = new Date()): Rapport {
  let weggelaten = 0;
  const filter = <T extends { gevoelig?: boolean }>(items: T[]): T[] => {
    if (!o.openbaar) return items;
    const zichtbaar = items.filter((i) => !i.gevoelig);
    weggelaten += items.length - zichtbaar.length;
    return zichtbaar;
  };

  const zichtbaar = zichtbareAspecten(c, a);
  const themas = c.themas.map((thema) => ({
    thema,
    aspecten: zichtbaar
      .filter((x) => x.thema === thema.id)
      .map((aspect): RapportAspect => {
        const antwoord = a.antwoorden[aspect.id];
        return {
          aspect,
          status: aspectStatus(antwoord),
          antwoord,
          risicos: filter(antwoord?.risicos ?? []).filter((r) => !leeg(r.omschrijving)),
          koppelingen: kaderIds.flatMap((k) =>
            (aspect.koppelingen[k] ?? []).flatMap(({ id }) => {
              const kader = c.kaders.get(k);
              const onderdeel = kader?.onderdelen.find((x) => x.id === id);
              return kader && onderdeel ? [{ kader: kader.afkorting, titel: onderdeel.titel, bron: onderdeel.bron }] : [];
            }),
          ),
        };
      }),
  }));
  const alleAspecten = themas.flatMap((t) => t.aspecten);

  const dekking: KaderDekking[] = [...dekkingPerKader(c, a).entries()].map(([k, rijen]) => {
    const kader = c.kaders.get(k)!;
    const tel = (s: OnderdeelDekking['status']) => rijen.filter((r) => r.status === s).length;
    return {
      kader: k,
      naam: kader.naam,
      afkorting: kader.afkorting,
      versie: a.kaderVersies[k] ?? kader.versie,
      rijen,
      behandeld: tel('behandeld'),
      nvt: tel('nvt'),
      open: tel('open'),
    };
  });

  let iea: Rapport['iea'];
  if (a.context.grensoverschrijdend === 'ja') {
    const bron = a.iea;
    const data: NonNullable<Assessment['iea']> = {
      initiatief: bron?.initiatief ?? '',
      bindendeEisen: filter(bron?.bindendeEisen ?? []).filter((x) => !leeg(x.omschrijving)),
      diensten: (bron?.diensten ?? []).filter((x) => !leeg(x.naam)),
      belanghebbenden: (bron?.belanghebbenden ?? []).filter((x) => !leeg(x.categorie)),
      effecten: Object.fromEntries(
        eifLagen.map((l) => [l, bron?.effecten[l] ?? { oordeel: null, toelichting: '' }]),
      ) as Record<EifLaag, { oordeel: 'beneficial' | 'negligible' | 'risky' | null; toelichting: string }>,
      ieOplossingen: (bron?.ieOplossingen ?? []).filter((x) => !leeg(x.naam)),
      andereOplossingen: (bron?.andereOplossingen ?? []).filter((x) => !leeg(x.naam)),
      belemmeringen: filter(bron?.belemmeringen ?? []).filter((x) => !leeg(x.omschrijving)),
      eerdereAssessments: (bron?.eerdereAssessments ?? []).filter((x) => !leeg(x.titel)),
    };
    iea = { verplichting: c.beslisboom ? beoordeelVerplichting(c.beslisboom, a.context.beslisboom) : undefined, data };
  }

  return {
    titel: a.context.dienst.trim() || 'Naamloos assessment',
    opgesteld: nu.toISOString(),
    openbaar: o.openbaar,
    weggelaten,
    samenvatting: {
      keuzes: alleAspecten
        .filter((x) => x.status === 'behandeld')
        .map((x) => ({ aspect: x.aspect.titel, keuze: x.antwoord!.keuze.trim() })),
      openAspecten: alleAspecten.filter((x) => x.status === 'open' || x.status === 'bezig').map((x) => x.aspect.titel),
      risicos: alleAspecten.flatMap((x) =>
        x.risicos.map((r) => ({ aspect: x.aspect.titel, omschrijving: r.omschrijving, eigenaar: r.eigenaar || undefined })),
      ),
      dekking,
    },
    context: a.context,
    themas,
    dekking,
    iea,
    verantwoording: {
      kaderVersies: kaderIds.flatMap((k) => {
        const kader = c.kaders.get(k);
        const versie = a.kaderVersies[k];
        return kader && versie
          ? [{ afkorting: kader.afkorting, naam: kader.naam, versie, huidigeVersie: kader.versie, bron: kader.bron }]
          : [];
      }),
      aangemaakt: a.aangemaakt,
      gewijzigd: a.gewijzigd,
      betrokkenen: a.context.betrokkenen.filter((b) => !leeg(b.naam)),
      assessmentId: a.id,
    },
  };
}
