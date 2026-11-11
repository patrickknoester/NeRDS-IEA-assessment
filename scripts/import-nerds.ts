/**
 * Importeert NeRDS uit een getagde release op GitHub naar data/kaders/nerds.yaml
 * en data/hulpmiddelen/nerds.yaml.
 *
 * Gebruik: node scripts/import-nerds.ts [tag]   (standaard de nieuwste release)
 */
import { parse } from 'yaml';
import { kaderSchema, type KaderOnderdeel } from '../src/model/kader.ts';
import { hulpmiddelenBestandSchema } from '../src/model/hulpmiddel.ts';
import { haal, haalJson, schrijfYaml } from './lib.ts';

const REPO = 'NederlandseDigitaleDienst/NeRDS';
const SITE = 'https://nerds.digitaledienst.overheid.nl';

const tag =
  process.argv[2] ?? (await haalJson<{ tag_name: string }>(`https://api.github.com/repos/${REPO}/releases/latest`)).tag_name;
const raw = (pad: string) => haal(`https://raw.githubusercontent.com/${REPO}/${tag}/${pad}`);
console.log(`NeRDS ${tag}`);

const mappen = (await haalJson<{ name: string; type: string }[]>(
  `https://api.github.com/repos/${REPO}/contents/docs/richtlijnen?ref=${tag}`,
)).filter((m) => m.type === 'dir');

interface Frontmatter { title: string; summary?: string; relations?: string[] }

const metNummer: { nummer: number; onderdeel: KaderOnderdeel }[] = [];
for (const { name: slug } of mappen) {
  const md = await raw(`docs/richtlijnen/${slug}/index.md`);
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`geen frontmatter in ${slug}`);
  const meta = parse(fm[1]) as Frontmatter;
  metNummer.push({
    // De titel begint met het richtlijnnummer, bijv. "10. Maak beter gebruik van data".
    nummer: Number(meta.title.match(/^(\d+)\./)?.[1] ?? 99),
    onderdeel: {
      id: slug,
      titel: meta.title,
      soort: 'richtlijn',
      samenvatting: meta.summary,
      bron: `${SITE}/richtlijnen/${slug}/`,
      status: 'actueel',
      relaties: meta.relations ?? [],
    },
  });
}
const onderdelen = metNummer.sort((a, b) => a.nummer - b.nummer).map((m) => m.onderdeel);

// Relaties naar een richtlijn die niet bestaat (bijv. een typefout in de bron) laten we weg.
const slugs = new Set(onderdelen.map((o) => o.id));
for (const o of onderdelen) {
  for (const r of o.relaties.filter((r) => !slugs.has(r)))
    console.warn(`let op: ${o.id} verwijst naar onbekende richtlijn "${r}" (fout in de bron?); overgeslagen`);
  o.relaties = o.relaties.filter((r) => slugs.has(r));
}

const kader = kaderSchema.parse({
  id: 'nerds',
  naam: 'Nederlandse Richtlijn Digitale Systemen',
  afkorting: 'NeRDS',
  beschrijving: 'Richtlijnen voor het ontwerpen, ontwikkelen en inkopen van digitale systemen binnen de Nederlandse overheid.',
  versie: tag,
  bron: `https://github.com/${REPO}/tree/${tag}`,
  licentie: 'EUPL-1.2',
  herkomst: 'scripts/import-nerds.ts',
  onderdelen,
});
schrijfYaml('data/kaders/nerds.yaml', `NeRDS ${tag}`, kader);

// Hulpmiddelen uit de action registry
interface Actie {
  id: string; name: string; source: string | null; description: string;
  richtlijn: string | string[]; fase?: string | string[]; status: string;
}
const { actions } = parse(await raw('docs/action-registry/actions.yaml')) as { actions: Actie[] };
const lijst = (x: string | string[] | undefined) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const hulpmiddelen = hulpmiddelenBestandSchema.parse({
  herkomst: 'scripts/import-nerds.ts (docs/action-registry/actions.yaml)',
  versie: tag,
  hulpmiddelen: actions.map((a) => ({
    id: `nerds-${a.id}`,
    naam: a.name,
    beschrijving: a.description,
    bron: a.source,
    onderdelen: lijst(a.richtlijn).map((r) => `nerds:${r}`),
    fases: lijst(a.fase),
    status: a.status,
  })),
});
schrijfYaml('data/hulpmiddelen/nerds.yaml', `NeRDS action registry ${tag}`, hulpmiddelen);
console.log(`${kader.onderdelen.length} onderdelen, ${hulpmiddelen.hulpmiddelen.length} hulpmiddelen`);
