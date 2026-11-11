import { describe, expect, it, vi } from 'vitest';
import { leesAssessment, nieuwAssessment, Store } from './store.ts';

function geheugen() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}

describe('Store', () => {
  it('bewaart automatisch en leest het terug', () => {
    vi.useFakeTimers();
    const opslag = geheugen();
    const s = new Store(opslag);
    s.open(nieuwAssessment({ nerds: 'v0.5.0' }));
    s.wijzig((a) => (a.context.dienst = 'Parkeervergunning'));
    vi.advanceTimersByTime(500);
    expect(new Store(opslag).bewaardeVersie()?.context.dienst).toBe('Parkeervergunning');
    vi.useRealTimers();
  });

  it('maakt een antwoord aan bij de eerste wijziging en meldt elke wijziging', () => {
    const s = new Store(geheugen());
    const gemeld = vi.fn();
    s.addEventListener('change', gemeld);
    s.open(nieuwAssessment({}));
    s.wijzigAntwoord('open-standaarden', (a) => (a.situatie = 'We gebruiken REST'));
    expect(s.assessment?.antwoorden['open-standaarden'].situatie).toBe('We gebruiken REST');
    expect(gemeld).toHaveBeenCalledTimes(2);
  });

  it('werkt zonder opslag (bijv. geblokkeerde localStorage)', () => {
    const s = new Store(undefined);
    s.open(nieuwAssessment({}));
    s.bewaarNu();
    expect(s.bewaard).toBeUndefined();
    expect(s.bewaardeVersie()).toBeUndefined();
  });

  it('wist het bewaarde assessment bij sluiten', () => {
    const opslag = geheugen();
    const s = new Store(opslag);
    s.open(nieuwAssessment({}));
    s.bewaarNu();
    s.sluit();
    expect(s.bewaardeVersie()).toBeUndefined();
  });
});

describe('half ingevuld werk', () => {
  it('blijft leesbaar na bewaren, ook met een leeg nieuw risico', () => {
    const opslag = geheugen();
    const s = new Store(opslag);
    s.open(nieuwAssessment({}));
    s.wijzigAntwoord('open-standaarden', (a) => {
      a.relevantie = 'nvt';
      a.risicos.push({ id: 'r1', omschrijving: '', gevoelig: false });
    });
    s.bewaarNu();
    const terug = new Store(opslag);
    expect(terug.bewaardeVersie()?.antwoorden['open-standaarden'].risicos).toHaveLength(1);
    expect(terug.onleesbareVersie()).toBeUndefined();
  });

  it('geeft onleesbare inhoud terug in plaats van die weg te gooien', () => {
    const opslag = geheugen();
    opslag.setItem('iea-assessment-poc:huidig', '{"kapot": true}');
    expect(new Store(opslag).onleesbareVersie()).toBe('{"kapot": true}');
  });
});

describe('leesAssessment', () => {
  it('leest een eigen export terug', () => {
    const s = new Store(undefined);
    s.open(nieuwAssessment({ nora: '2026-11-11' }));
    const r = leesAssessment(s.alsJson());
    expect(r.ok && r.assessment.kaderVersies).toEqual({ nora: '2026-11-11' });
  });

  it('geeft een leesbare fout bij onzin en bij een andere schemaversie', () => {
    expect(leesAssessment('{x')).toEqual({ ok: false, fout: 'Dit bestand is geen geldig JSON-bestand.' });
    const r = leesAssessment(JSON.stringify({ schemaVersie: 2 }));
    expect(!r.ok && r.fout).toMatch(/schemaversie 2/);
  });
});
