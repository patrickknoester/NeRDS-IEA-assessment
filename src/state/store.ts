import {
  aspectAntwoordSchema,
  assessmentSchema,
  SCHEMA_VERSIE,
  type AspectAntwoord,
  type Assessment,
} from '../model/assessment.ts';
import type { KaderId } from '../model/kader.ts';

const OPSLAGSLEUTEL = 'iea-assessment-poc:huidig';

export const nu = () => new Date().toISOString();
export const nieuwId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export function nieuwAssessment(kaderVersies: Partial<Record<KaderId, string>>): Assessment {
  const t = nu();
  return assessmentSchema.parse({
    schemaVersie: SCHEMA_VERSIE,
    id: nieuwId(),
    aangemaakt: t,
    gewijzigd: t,
    kaderVersies,
    context: { organisatie: {} },
  });
}

export function leegAntwoord(): AspectAntwoord {
  return aspectAntwoordSchema.parse({ gewijzigd: nu() });
}

/** Leest een JSON-bestand. Geeft een leesbare foutmelding als het geen geldig assessment is. */
export function leesAssessment(tekst: string): { ok: true; assessment: Assessment } | { ok: false; fout: string } {
  let data: unknown;
  try {
    data = JSON.parse(tekst);
  } catch {
    return { ok: false, fout: 'Dit bestand is geen geldig JSON-bestand.' };
  }
  const r = assessmentSchema.safeParse(data);
  if (r.success) return { ok: true, assessment: r.data };
  const eerste = r.error.issues[0];
  const versie = (data as { schemaVersie?: unknown })?.schemaVersie;
  if (versie !== undefined && versie !== SCHEMA_VERSIE)
    return { ok: false, fout: `Dit bestand heeft schemaversie ${String(versie)}; deze versie van de tool leest versie ${SCHEMA_VERSIE}.` };
  return { ok: false, fout: `Dit bestand is geen geldig assessment (${eerste.path.join('.') || 'bestand'}: ${eerste.message}).` };
}

type Opslag = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function veiligeOpslag(): Opslag | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Houdt het huidige assessment bij en bewaart het automatisch in de browser.
 * Luister naar 'change' om opnieuw te tekenen.
 */
export class Store extends EventTarget {
  assessment: Assessment | undefined;
  /** Laatste moment van automatisch bewaren, of undefined als bewaren niet lukt. */
  bewaard: string | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private readonly opslag: Opslag | undefined;

  constructor(opslag: Opslag | undefined = veiligeOpslag()) {
    super();
    this.opslag = opslag;
  }

  /** Het assessment dat nog in de browser stond, als dat er is en geldig is. */
  bewaardeVersie(): Assessment | undefined {
    try {
      const tekst = this.opslag?.getItem(OPSLAGSLEUTEL);
      if (!tekst) return undefined;
      const r = leesAssessment(tekst);
      return r.ok ? r.assessment : undefined;
    } catch {
      return undefined;
    }
  }

  /** De ruwe tekst in de browser als die niet (meer) als assessment te lezen is, om niets kwijt te raken. */
  onleesbareVersie(): string | undefined {
    try {
      const tekst = this.opslag?.getItem(OPSLAGSLEUTEL);
      return tekst && !leesAssessment(tekst).ok ? tekst : undefined;
    } catch {
      return undefined;
    }
  }

  open(assessment: Assessment): void {
    this.assessment = assessment;
    this.bewaarStraks();
    this.meld();
  }

  /** Terug naar het startscherm; het assessment blijft in de browser bewaard. */
  verlaat(): void {
    this.bewaarNu();
    this.assessment = undefined;
    this.meld();
  }

  sluit(): void {
    this.assessment = undefined;
    try {
      this.opslag?.removeItem(OPSLAGSLEUTEL);
    } catch {
      /* niets aan te doen */
    }
    this.meld();
  }

  /** Wijzig het assessment. De functie krijgt een kopie en mag die aanpassen. */
  wijzig(f: (a: Assessment) => void): void {
    if (!this.assessment) return;
    const kopie = structuredClone(this.assessment);
    f(kopie);
    kopie.gewijzigd = nu();
    this.assessment = kopie;
    this.bewaarStraks();
    this.meld();
  }

  /** Wijzig het antwoord op één aspect; maakt het aan als het er nog niet is. */
  wijzigAntwoord(aspectId: string, f: (a: AspectAntwoord) => void): void {
    this.wijzig((a) => {
      const antwoord = a.antwoorden[aspectId] ?? leegAntwoord();
      f(antwoord);
      antwoord.gewijzigd = nu();
      a.antwoorden[aspectId] = antwoord;
    });
  }

  alsJson(): string {
    return JSON.stringify(this.assessment, null, 2);
  }

  bewaarNu(): void {
    clearTimeout(this.timer);
    if (!this.assessment) return;
    try {
      this.opslag?.setItem(OPSLAGSLEUTEL, this.alsJson());
      this.bewaard = this.opslag ? nu() : undefined;
    } catch {
      this.bewaard = undefined;
    }
    this.meld();
  }

  private bewaarStraks(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.bewaarNu(), 400);
  }

  private meld(): void {
    this.dispatchEvent(new Event('change'));
  }
}

