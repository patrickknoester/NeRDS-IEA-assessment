/**
 * Importeert uit NORA Online (Semantic MediaWiki-API):
 * - data/kaders/nora.yaml: architectuurprincipes (NAP) en kwaliteitsdoelen (KD)
 * - data/kaders/gdi.yaml: principes van de GDI-domeinarchitectuur Gegevensuitwisseling
 *
 * Neemt alleen ID's, titels, status en bronlinks over (licentie van de teksten nog niet nagegaan).
 * Gebruik: node scripts/import-nora.ts
 */
import { kaderSchema, type KaderOnderdeel } from '../src/model/kader.ts';
import { haalJson, schrijfYaml } from './lib.ts';

const API = 'https://www.noraonline.nl/api.php';

interface Waarde { fulltext?: string; timestamp?: string; raw?: string }
interface Resultaat { fulltext: string; fullurl: string; displaytitle?: string; printouts: Record<string, (Waarde | string)[]> }

async function vraag(query: string): Promise<Resultaat[]> {
  const url = `${API}?action=ask&format=json&query=${encodeURIComponent(query)}`;
  const data = await haalJson<{ query: { results: Record<string, Resultaat> | [] } }>(url);
  return Object.values(data.query.results);
}

const tekst = (r: Resultaat, eigenschap: string): string | undefined => {
  const w = r.printouts[eigenschap]?.[0];
  return w == null ? undefined : typeof w === 'string' ? w : (w.fulltext ?? w.raw);
};
const status = (r: Resultaat): KaderOnderdeel['status'] =>
  /uitgefaseerd|vervangen/i.test(tekst(r, 'Status actualiteit') ?? '') ? 'uitgefaseerd' : 'actueel';
const vandaag = new Date().toISOString().slice(0, 10);

// NORA: architectuurprincipes (NAPxx) en kwaliteitsdoelen (KDxx)
const nora: KaderOnderdeel[] = [];
for (const [type, soort, prefix] of [
  ['Kwaliteitsdoel', 'kwaliteitsdoel', 'KD'],
  ['Architectuurprincipe', 'architectuurprincipe', 'NAP'],
] as const) {
  const resultaten = await vraag(`[[Elementtype::${type}]]|?ID|?Status actualiteit|limit=200`);
  for (const r of resultaten) {
    const id = tekst(r, 'ID');
    if (!id || !new RegExp(`^${prefix}\\d+$`).test(id)) continue; // alleen de officiële reeks
    // NORA hergebruikt soms een ID (bijv. KD17). Dan wint het actuele onderdeel.
    const bestaand = nora.findIndex((o) => o.id === id.toLowerCase());
    if (bestaand >= 0) {
      console.warn(`let op: ${id} komt dubbel voor in NORA ("${nora[bestaand].titel}" en "${r.fulltext}")`);
      if (status(r) === 'uitgefaseerd') continue;
      nora.splice(bestaand, 1);
    }
    nora.push({
      id: id.toLowerCase(),
      titel: r.fulltext.replace(/ \(Doel\)$/, ''),
      soort,
      bron: r.fullurl,
      status: status(r),
      relaties: [],
    });
  }
}
nora.sort((a, b) => a.id.localeCompare(b.id, 'nl', { numeric: true }));

schrijfYaml('data/kaders/nora.yaml', `NORA, geïmporteerd ${vandaag}`, kaderSchema.parse({
  id: 'nora',
  naam: 'Nederlandse Overheid Referentie Architectuur',
  afkorting: 'NORA',
  beschrijving: 'Architectuurprincipes (NAP) en kwaliteitsdoelen (KD) van de NORA.',
  versie: vandaag,
  bron: 'https://www.noraonline.nl',
  herkomst: 'scripts/import-nora.ts',
  onderdelen: nora,
}));

// GDI-domeinarchitectuur Gegevensuitwisseling: ArchiMate-principes "1.1. ..." t/m "6.1. ..."
const gdi: KaderOnderdeel[] = [];
for (const r of await vraag('[[Elementtype::Principle]]|?Label|limit=200')) {
  const label = tekst(r, 'Label') ?? r.displaytitle ?? '';
  const m = label.match(/^(\d+\.\d+)\.?\s+(.+)$/);
  if (!m) continue;
  gdi.push({
    id: `gegevensuitwisseling/${m[1]}`,
    titel: `${m[1]} ${m[2]}`,
    soort: 'principe',
    bron: r.fullurl,
    status: 'actueel',
    ouder: 'gegevensuitwisseling',
    relaties: [],
  });
}
gdi.sort((a, b) => a.id.localeCompare(b.id, 'nl', { numeric: true }));

schrijfYaml('data/kaders/gdi.yaml', `GDI-domeinarchitecturen, geïmporteerd ${vandaag}`, kaderSchema.parse({
  id: 'gdi',
  naam: 'GDI-domeinarchitecturen',
  afkorting: 'GDI',
  beschrijving: 'Domeinarchitecturen van de Generieke Digitale Infrastructuur. Nu alleen het domein Gegevensuitwisseling.',
  versie: vandaag,
  bron: 'https://www.noraonline.nl',
  herkomst: 'scripts/import-nora.ts',
  onderdelen: [
    {
      id: 'gegevensuitwisseling',
      titel: 'Domeinarchitectuur Gegevensuitwisseling',
      soort: 'domein',
      bron: 'https://www.noraonline.nl/images/noraonline/9/98/GA_domein_Gegevensuitwisseling_v1.0.pdf',
      status: 'actueel',
      relaties: [],
    },
    ...gdi,
  ],
}));
console.log(`NORA: ${nora.length} onderdelen, GDI: ${gdi.length + 1} onderdelen`);
