import type { Aspect } from './aspect.ts';
import type { AspectAntwoord, Assessment } from './assessment.ts';
import type { Catalogus } from '../data/catalogus.ts';
import type { KaderId } from './kader.ts';

export type AspectStatus = 'open' | 'bezig' | 'behandeld' | 'nvt';

/** Welke aspecten de invuller te zien krijgt: grensoverschrijdende alleen als de dienst dat is. */
export function zichtbareAspecten(c: Catalogus, a: Assessment): Aspect[] {
  const grens = a.context.grensoverschrijdend === 'ja';
  return c.aspecten.filter((x) => x.geldt_als === 'altijd' || grens);
}

/**
 * Behandeld = van toepassing en de afweging is vastgelegd (situatie, keuze en motivatie).
 * N.v.t. telt alleen met een reden; dat dwingt het schema al af.
 */
export function aspectStatus(antwoord: AspectAntwoord | undefined): AspectStatus {
  if (!antwoord) return 'open';
  if (antwoord.relevantie === 'nvt') return (antwoord.nvtReden ?? '').trim() ? 'nvt' : 'bezig';
  const velden = [antwoord.situatie, antwoord.keuze, antwoord.motivatie].map((v) => v.trim().length > 0);
  if (antwoord.relevantie === 'van-toepassing' && velden.every(Boolean)) return 'behandeld';
  return velden.some(Boolean) || antwoord.overweging.trim() || antwoord.relevantie !== 'open' ? 'bezig' : 'open';
}

export interface Telling {
  open: number;
  bezig: number;
  behandeld: number;
  nvt: number;
  totaal: number;
}

export function tel(statussen: AspectStatus[]): Telling {
  const t: Telling = { open: 0, bezig: 0, behandeld: 0, nvt: 0, totaal: statussen.length };
  for (const s of statussen) t[s]++;
  return t;
}

export function voortgangPerThema(c: Catalogus, a: Assessment): Map<string, Telling> {
  const zichtbaar = zichtbareAspecten(c, a);
  return new Map(
    c.themas.map((t) => [t.id, tel(zichtbaar.filter((x) => x.thema === t.id).map((x) => aspectStatus(a.antwoorden[x.id])))]),
  );
}

export type DekkingStatus = 'behandeld' | 'nvt' | 'open';

export interface OnderdeelDekking {
  kader: KaderId;
  onderdeel: string;
  titel: string;
  bron: string;
  status: DekkingStatus;
  aspecten: string[];
}

/**
 * Dekking per kaderonderdeel, afgeleid uit de aspecten die eraan gekoppeld zijn:
 * behandeld als minstens één gekoppeld aspect behandeld is, n.v.t. als alle gekoppelde aspecten
 * n.v.t. zijn, en anders open. Onderdelen zonder zichtbaar gekoppeld aspect vallen weg.
 */
export function dekkingPerKader(c: Catalogus, a: Assessment): Map<KaderId, OnderdeelDekking[]> {
  const zichtbaar = zichtbareAspecten(c, a);
  const uit = new Map<KaderId, OnderdeelDekking[]>();
  for (const kader of c.kaders.values()) {
    const rijen: OnderdeelDekking[] = [];
    for (const o of kader.onderdelen) {
      const gekoppeld = zichtbaar.filter((x) => (x.koppelingen[kader.id] ?? []).some((k) => k.id === o.id));
      if (!gekoppeld.length) continue;
      const statussen = gekoppeld.map((x) => aspectStatus(a.antwoorden[x.id]));
      const status: DekkingStatus = statussen.includes('behandeld')
        ? 'behandeld'
        : statussen.every((s) => s === 'nvt')
          ? 'nvt'
          : 'open';
      rijen.push({ kader: kader.id, onderdeel: o.id, titel: o.titel, bron: o.bron, status, aspecten: gekoppeld.map((x) => x.id) });
    }
    if (rijen.length) uit.set(kader.id, rijen);
  }
  return uit;
}
