import { describe, expect, it } from 'vitest';
import { catalogus } from '../data/laad.ts';
import { leegAntwoord, nieuwAssessment } from '../state/store.ts';
import { ieaSchema } from './assessment.ts';
import { ieaExport } from './iea-export.ts';
import { bouwRapport, geldigeUrl } from './rapport.ts';

function voorbeeld() {
  const a = nieuwAssessment({ nerds: 'v0.4.0', nora: '2026-11-11' });
  a.context.dienst = 'Parkeerkaart';
  a.antwoorden['open-standaarden'] = {
    ...leegAntwoord(),
    relevantie: 'van-toepassing',
    situatie: 's',
    keuze: 'We gebruiken NL GOV API Design Rules',
    motivatie: 'm',
    risicos: [
      { id: 'r1', omschrijving: 'Leverancier ondersteunt dit nog niet', eigenaar: 'CIO', gevoelig: false },
      { id: 'r2', omschrijving: 'Kwetsbaarheid in oud systeem', gevoelig: true },
      { id: 'r3', omschrijving: '', gevoelig: false },
    ],
  };
  return a;
}

describe('bouwRapport', () => {
  it('vat keuzes, open aspecten en risico’s samen', () => {
    const r = bouwRapport(catalogus, voorbeeld(), { openbaar: false });
    expect(r.samenvatting.keuzes).toEqual([{ aspect: 'Gebruik van open standaarden', keuze: 'We gebruiken NL GOV API Design Rules' }]);
    expect(r.samenvatting.risicos.map((x) => x.omschrijving)).toEqual([
      'Leverancier ondersteunt dit nog niet',
      'Kwetsbaarheid in oud systeem',
    ]);
    expect(r.samenvatting.openAspecten).toHaveLength(11);
    expect(r.iea).toBeUndefined();
  });

  it('laat gevoelige onderdelen weg in de openbare versie en telt ze', () => {
    const r = bouwRapport(catalogus, voorbeeld(), { openbaar: true });
    expect(r.samenvatting.risicos.map((x) => x.omschrijving)).toEqual(['Leverancier ondersteunt dit nog niet']);
    expect(r.weggelaten).toBe(1);
  });

  it('noemt de gebruikte kaderversie naast de huidige', () => {
    const r = bouwRapport(catalogus, voorbeeld(), { openbaar: false });
    expect(r.verantwoording.kaderVersies.find((k) => k.afkorting === 'NeRDS')).toMatchObject({ versie: 'v0.4.0', huidigeVersie: 'v0.5.0' });
  });
});

describe('ieaExport', () => {
  it('geeft niets voor een dienst die niet grensoverschrijdend is', () => {
    expect(ieaExport(catalogus, voorbeeld())).toBeUndefined();
  });

  it('volgt de bijlage en laat gevoelige eisen altijd weg', () => {
    const a = voorbeeld();
    a.context.grensoverschrijdend = 'ja';
    a.iea = ieaSchema.parse({
      bindendeEisen: [
        { id: 'e1', omschrijving: 'Kaart moet digitaal controleerbaar zijn', gevoelig: false },
        { id: 'e2', omschrijving: 'Geheim', gevoelig: true },
      ],
      effecten: { juridisch: { oordeel: 'beneficial', toelichting: 'Grondslag is helder' } },
      ieOplossingen: [{ id: 'o1', naam: 'Core Person Vocabulary', url: 'niet-een-url' }],
    });
    const e = ieaExport(catalogus, a)!;
    expect(e.requirements.bindingRequirements).toEqual([{ description: 'Kaart moet digitaal controleerbaar zijn', source: null }]);
    expect(e.requirements.effectsOnCrossBorderInteroperability.legal).toEqual({ assessment: 'beneficial', explanation: 'Grondslag is helder' });
    expect(e.requirements.effectsOnCrossBorderInteroperability.technical.assessment).toBeNull();
    expect(e.results.interoperableEuropeSolutions[0]).toEqual({ name: 'Core Person Vocabulary', url: null, description: null });
    expect(e.metadata.redactedItems).toBe(2);
  });
});

describe('geldigeUrl', () => {
  it('accepteert alleen http(s)', () => {
    expect(geldigeUrl('https://example.org')).toBe('https://example.org/');
    expect(geldigeUrl('javascript:alert(1)')).toBeUndefined();
    expect(geldigeUrl('http')).toBeUndefined();
  });
});
