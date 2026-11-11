import { describe, expect, it } from 'vitest';
import { aspectSchema } from './aspect.ts';

const voorbeeld = {
  id: 'hergebruik-bouwstenen',
  thema: 'hergebruik',
  titel: 'Hergebruik van bestaande voorzieningen',
  toelichting: 'Welke bestaande bouwstenen gebruikt de dienst?',
  geldt_als: 'altijd',
  koppelingen: { eif: ['technisch', 'organisatorisch'], gdi: ['toegang'] },
};

describe('aspectSchema', () => {
  it('accepteert een geldig aspect', () => {
    expect(aspectSchema.parse(voorbeeld)).toEqual(voorbeeld);
  });

  it('weigert een onbekend kader in de koppelingen', () => {
    const fout = { ...voorbeeld, koppelingen: { onbekend: ['x'] } };
    expect(aspectSchema.safeParse(fout).success).toBe(false);
  });

  it('weigert een ongeldige id', () => {
    expect(aspectSchema.safeParse({ ...voorbeeld, id: 'Met Spaties' }).success).toBe(false);
  });
});
