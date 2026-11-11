/**
 * Maakt docs/crosswalk-review.md: de crosswalk per thema en een dekkingsmatrix,
 * bedoeld om met architecten te reviewen. Gebruik: node scripts/crosswalk-review.ts
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { bouwCatalogus } from '../src/data/catalogus.ts';
import { kaderIds } from '../src/model/kader.ts';

function yamlBestanden(map: string): Record<string, string> {
  const uit: Record<string, string> = {};
  for (const naam of readdirSync(map)) {
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) Object.assign(uit, yamlBestanden(pad));
    else if (naam.endsWith('.yaml')) uit[pad] = readFileSync(pad, 'utf8');
  }
  return uit;
}

const { catalogus: c, fouten } = bouwCatalogus(yamlBestanden('data'));
if (fouten.length) {
  console.error(fouten);
  process.exit(1);
}

const cel = (t: string) => t.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const titelVan = (kader: string, id: string) =>
  c.kaders.get(kader as (typeof kaderIds)[number])?.onderdelen.find((o) => o.id === id)?.titel ?? id;
const kaders = kaderIds.filter((k) => c.kaders.has(k));
const r: string[] = [];

r.push('# Crosswalk: voorstel voor review', '');
r.push('> Gegenereerd met `node scripts/crosswalk-review.ts` uit `data/`. Niet met de hand bewerken.', '');
r.push(
  'Deze crosswalk koppelt **aspecten** (vragen in het assessment) aan de onderdelen van de kaders.',
  'Wie een aspect invult, behandelt daarmee alle gekoppelde kaderonderdelen tegelijk.',
  'Dit is een **eerste voorstel** voor drie thema\'s. Bij elke koppeling staat waarom hij er volgens ons bij hoort.',
  '',
  '**Vragen aan reviewers**',
  '',
  '1. Klopt elke koppeling? Ontbreken er koppelingen die voor de hand liggen?',
  '2. Zijn de aspecten goed afgebakend: niet te groot, niet overlappend?',
  '3. Zijn de hulpvragen bruikbaar voor iemand zonder architectuurachtergrond?',
  '4. Welke kaderonderdelen in de dekkingsmatrix horen wél bij deze thema\'s, maar zijn nog niet gekoppeld?',
  '',
);

r.push('## Gebruikte kaderversies', '', '| Kader | Versie | Bron | Herkomst |', '|---|---|---|---|');
for (const k of kaders) {
  const kader = c.kaders.get(k)!;
  r.push(`| ${kader.afkorting} | ${kader.versie} | ${kader.bron} | ${cel(kader.herkomst)} |`);
}
r.push('');

for (const thema of c.themas) {
  r.push(`## Thema: ${thema.titel}`, '');
  if (thema.toelichting) r.push(`_${thema.toelichting}_`, '');
  for (const a of c.aspecten.filter((a) => a.thema === thema.id)) {
    const label = a.geldt_als === 'grensoverschrijdend' ? ' 🇪🇺 _alleen bij grensoverschrijdende diensten_' : '';
    r.push(`### ${a.titel}${label}`, '', `\`${a.id}\` · ${a.toelichting}`, '');
    if (a.hulpvragen.length) r.push(...a.hulpvragen.map((h) => `- ${h}`), '');
    r.push('| Kader | Onderdeel | Waarom |', '|---|---|---|');
    for (const k of kaders)
      for (const { id, waarom } of a.koppelingen[k] ?? [])
        r.push(`| ${c.kaders.get(k)!.afkorting} | ${cel(titelVan(k, id))} (\`${id}\`) | ${cel(waarom ?? '')} |`);
    r.push('');
  }
}

r.push('## Dekkingsmatrix', '');
r.push(
  'Per kaderonderdeel: in hoeveel aspecten per thema het voorkomt. Een leeg vak is niet per se een fout:',
  'de POC werkt nog maar drie thema\'s uit. Uitgefaseerde onderdelen zijn weggelaten.',
  '',
);
for (const k of kaders) {
  const kader = c.kaders.get(k)!;
  r.push(`### ${kader.naam} (${kader.afkorting} ${kader.versie})`, '');
  r.push(`| Onderdeel | ${c.themas.map((t) => t.titel).join(' | ')} |`, `|---|${c.themas.map(() => ':-:').join('|')}|`);
  let gedekt = 0;
  const actueel = kader.onderdelen.filter((o) => o.status !== 'uitgefaseerd');
  for (const o of actueel) {
    const tellingen = c.themas.map(
      (t) => c.aspecten.filter((a) => a.thema === t.id && (a.koppelingen[k] ?? []).some((x) => x.id === o.id)).length,
    );
    if (tellingen.some((n) => n > 0)) gedekt++;
    r.push(`| ${cel(o.titel)} | ${tellingen.map((n) => (n ? String(n) : '')).join(' | ')} |`);
  }
  r.push('', `**${gedekt} van ${actueel.length}** onderdelen gekoppeld.`, '');
}

writeFileSync('docs/crosswalk-review.md', r.join('\n'));
console.log('geschreven: docs/crosswalk-review.md');
