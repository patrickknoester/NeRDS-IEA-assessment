import { describe, expect, it } from 'vitest';
import { aspectStatus, dekkingPerKader, voortgangPerThema, zichtbareAspecten } from './voortgang.ts';
import { catalogus } from '../data/laad.ts';
import { leegAntwoord, nieuwAssessment } from '../state/store.ts';

describe('aspectStatus', () => {
  it('is open zonder antwoord, bezig met een deel en behandeld met situatie, keuze en motivatie', () => {
    expect(aspectStatus(undefined)).toBe('open');
    const a = leegAntwoord();
    expect(aspectStatus(a)).toBe('open');
    a.situatie = 'x';
    expect(aspectStatus(a)).toBe('bezig');
    Object.assign(a, { relevantie: 'van-toepassing', keuze: 'y', motivatie: 'z' });
    expect(aspectStatus(a)).toBe('behandeld');
  });

  it('telt n.v.t. alleen met reden', () => {
    expect(aspectStatus({ ...leegAntwoord(), relevantie: 'nvt' })).toBe('bezig');
    expect(aspectStatus({ ...leegAntwoord(), relevantie: 'nvt', nvtReden: 'geen gegevens' })).toBe('nvt');
  });
});

describe('met de echte crosswalk', () => {
  it('toont grensoverschrijdende aspecten alleen bij een grensoverschrijdende dienst', () => {
    const a = nieuwAssessment({});
    const lokaal = zichtbareAspecten(catalogus, a).length;
    a.context.grensoverschrijdend = 'ja';
    expect(zichtbareAspecten(catalogus, a).length).toBe(lokaal + 3);
  });

  it('telt per thema en leidt de dekking per kader af', () => {
    const a = nieuwAssessment({});
    a.antwoorden['gegevens-bij-de-bron'] = {
      ...leegAntwoord(),
      relevantie: 'van-toepassing',
      situatie: 's',
      keuze: 'k',
      motivatie: 'm',
    };
    expect(voortgangPerThema(catalogus, a).get('gegevens')).toMatchObject({ behandeld: 1, open: 3, totaal: 4 });
    const nap12 = dekkingPerKader(catalogus, a).get('nora')?.find((d) => d.onderdeel === 'nap12');
    expect(nap12).toMatchObject({ status: 'behandeld', aspecten: ['gegevens-bij-de-bron'] });
  });
});
