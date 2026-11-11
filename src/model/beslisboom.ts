import { z } from 'zod';

export const beslisboomSchema = z.object({
  bron: z.url(),
  versie: z.string(),
  vragen: z
    .array(z.object({ id: z.string().min(1), vraag: z.string().min(1), bij_nee: z.string().min(1) }))
    .min(1),
  uitkomst_verplicht: z.string(),
  uitkomst_niet_verplicht: z.string(),
});
export type Beslisboom = z.infer<typeof beslisboomSchema>;

export type BeslisboomUitkomst =
  | { status: 'verplicht' }
  | { status: 'niet-verplicht'; vraagId: string; reden: string }
  | { status: 'onbekend'; volgendeVraagId: string };

/**
 * Loopt de vragen op volgorde langs. Het eerste "nee" beslist: niet verplicht.
 * Is een vraag nog niet beantwoord, dan is dat de volgende vraag.
 */
export function beoordeelVerplichting(
  boom: Beslisboom,
  antwoorden: Record<string, 'ja' | 'nee' | null | undefined>,
): BeslisboomUitkomst {
  for (const vraag of boom.vragen) {
    const antwoord = antwoorden[vraag.id];
    if (antwoord === 'nee') return { status: 'niet-verplicht', vraagId: vraag.id, reden: vraag.bij_nee };
    if (antwoord !== 'ja') return { status: 'onbekend', volgendeVraagId: vraag.id };
  }
  return { status: 'verplicht' };
}
