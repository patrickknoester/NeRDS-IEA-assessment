import { describe, expect, it } from 'vitest';
import { bouwCatalogus } from './catalogus.ts';
import { catalogus, fouten } from './laad.ts';

const kader = `
id: nerds
naam: NeRDS
afkorting: NeRDS
versie: v1
bron: https://example.org
herkomst: test
onderdelen:
  - { id: data, titel: Data, soort: richtlijn, bron: https://example.org/data, relaties: [privacy] }
  - { id: privacy, titel: Privacy, soort: richtlijn, bron: https://example.org/privacy }
`;
const themas = `themas: [{ id: gegevens, titel: Gegevens, volgorde: 1 }]`;
const aspect = (koppeling: string, thema = 'gegevens') => `
aspecten:
  - id: gegevens-bij-de-bron
    thema: ${thema}
    titel: Gegevens bij de bron
    toelichting: Haal je gegevens op bij de bron?
    geldt_als: altijd
    koppelingen: { nerds: [${koppeling}] }
`;

describe('bouwCatalogus', () => {
  it('accepteert een kloppende set bestanden', () => {
    const { catalogus, fouten } = bouwCatalogus({
      'data/kaders/nerds.yaml': kader,
      'data/themas.yaml': themas,
      'data/aspecten/gegevens.yaml': aspect('data'),
    });
    expect(fouten).toEqual([]);
    expect(catalogus.aspecten).toHaveLength(1);
    expect(catalogus.kaders.get('nerds')?.onderdelen).toHaveLength(2);
  });

  it('meldt een koppeling naar een kaderonderdeel dat niet bestaat', () => {
    const { fouten } = bouwCatalogus({
      'data/kaders/nerds.yaml': kader,
      'data/themas.yaml': themas,
      'data/aspecten/gegevens.yaml': aspect('bestaat-niet'),
    });
    expect(fouten).toEqual([
      { bestand: 'data/aspecten/gegevens.yaml', melding: 'gegevens-bij-de-bron: nerds:bestaat-niet bestaat niet' },
    ]);
  });

  it('meldt een onbekend thema', () => {
    const { fouten } = bouwCatalogus({
      'data/kaders/nerds.yaml': kader,
      'data/themas.yaml': themas,
      'data/aspecten/x.yaml': aspect('data', 'onbekend'),
    });
    expect(fouten.map((f) => f.melding)).toContain('gegevens-bij-de-bron: thema onbekend bestaat niet');
  });

  it('meldt dubbele onderdeel-ID’s en relaties die niet bestaan', () => {
    const fout = kader.replace('relaties: [privacy]', 'relaties: [weg]').replace('id: privacy', 'id: data');
    const meldingen = bouwCatalogus({ 'data/kaders/nerds.yaml': fout }).fouten.map((f) => f.melding);
    expect(meldingen).toContain('onderdeel-ID data komt dubbel voor');
    expect(meldingen).toContain('data: relatie weg bestaat niet');
  });

  it('meldt schemafouten met het pad in het bestand', () => {
    const { fouten } = bouwCatalogus({ 'data/kaders/nerds.yaml': kader.replace('bron: https://example.org\n', '') });
    expect(fouten).toEqual([{ bestand: 'data/kaders/nerds.yaml', melding: expect.stringMatching(/^bron:/) }]);
  });

  it('meldt bestanden die niet in de mappenstructuur passen', () => {
    expect(bouwCatalogus({ 'data/los.yaml': 'a: 1' }).fouten[0].melding).toMatch(/onbekend bestand/);
  });
});

describe('de echte data in data/', () => {
  it('heeft geen fouten', () => {
    expect(fouten).toEqual([]);
  });

  it('bevat de kaders NeRDS, NORA, GDI, EIF en IEA', () => {
    expect([...catalogus.kaders.keys()].sort()).toEqual(['eif', 'gdi', 'iea', 'nerds', 'nora']);
  });

  it('heeft de IEA-beslisboom met zes vragen', () => {
    expect(catalogus.beslisboom?.vragen).toHaveLength(6);
  });
});
