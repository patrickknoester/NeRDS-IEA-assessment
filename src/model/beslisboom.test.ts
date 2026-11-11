import { describe, expect, it } from 'vitest';
import { beoordeelVerplichting, type Beslisboom } from './beslisboom.ts';

const boom: Beslisboom = {
  bron: 'https://example.org',
  versie: 'test',
  vragen: [
    { id: 'a', vraag: 'A?', bij_nee: 'niet door A' },
    { id: 'b', vraag: 'B?', bij_nee: 'niet door B' },
  ],
  uitkomst_verplicht: 'verplicht',
  uitkomst_niet_verplicht: 'niet verplicht',
};

describe('beoordeelVerplichting', () => {
  it('is verplicht als alle antwoorden ja zijn', () => {
    expect(beoordeelVerplichting(boom, { a: 'ja', b: 'ja' })).toEqual({ status: 'verplicht' });
  });

  it('stopt bij het eerste nee, met de reden', () => {
    expect(beoordeelVerplichting(boom, { a: 'nee', b: 'ja' })).toEqual({
      status: 'niet-verplicht',
      vraagId: 'a',
      reden: 'niet door A',
    });
  });

  it('wijst de eerste onbeantwoorde vraag aan', () => {
    expect(beoordeelVerplichting(boom, { a: 'ja' })).toEqual({ status: 'onbekend', volgendeVraagId: 'b' });
    expect(beoordeelVerplichting(boom, {})).toEqual({ status: 'onbekend', volgendeVraagId: 'a' });
  });
});
