import { describe, expect, it } from 'vitest';
import { aspectAntwoordSchema, assessmentSchema, SCHEMA_VERSIE } from './assessment.ts';

const nu = '2026-11-11T20:00:00+01:00';

describe('aspectAntwoordSchema', () => {
  it('vult lege velden aan met standaardwaarden', () => {
    const a = aspectAntwoordSchema.parse({ gewijzigd: nu });
    expect(a).toMatchObject({ relevantie: 'open', situatie: '', risicos: [], onderbouwing: [] });
  });

  it('accepteert half ingevuld werk, zoals n.v.t. zonder reden of een leeg nieuw risico', () => {
    const r = aspectAntwoordSchema.safeParse({
      relevantie: 'nvt',
      risicos: [{ id: 'r1', omschrijving: '' }],
      onderbouwing: [{ id: 'l1', titel: '', url: 'http' }],
      gewijzigd: nu,
    });
    expect(r.success).toBe(true);
  });
});

describe('assessmentSchema', () => {
  const minimaal = {
    schemaVersie: SCHEMA_VERSIE,
    id: 'a1',
    aangemaakt: nu,
    gewijzigd: nu,
    kaderVersies: { nerds: 'v0.5.0' },
    context: { organisatie: {} },
  };

  it('accepteert een nieuw, leeg assessment', () => {
    const a = assessmentSchema.parse(minimaal);
    expect(a.context.beslisboom).toEqual({});
    expect(a.antwoorden).toEqual({});
  });

  it('weigert een onbekende schemaversie', () => {
    expect(assessmentSchema.safeParse({ ...minimaal, schemaVersie: 99 }).success).toBe(false);
  });

  it('vult de IEA-effecten per EIF-laag aan', () => {
    const a = assessmentSchema.parse({ ...minimaal, iea: {} });
    expect(Object.keys(a.iea!.effecten)).toEqual(['juridisch', 'organisatorisch', 'semantisch', 'technisch']);
  });
});
