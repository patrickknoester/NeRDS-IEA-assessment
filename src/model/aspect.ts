import { z } from 'zod';
import { kaderIdSchema } from './kader.ts';

export const koppelingSchema = z
  .union([z.string().min(1), z.object({ id: z.string().min(1), waarom: z.string().min(1) })])
  .transform((k) => (typeof k === 'string' ? { id: k, waarom: undefined } : k));
export type Koppeling = z.output<typeof koppelingSchema>;

export const aspectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'gebruik kleine letters, cijfers en streepjes'),
  thema: z.string().min(1),
  titel: z.string().min(1),
  toelichting: z.string().min(1),
  /** Vragen die de invuller helpen nadenken; geen checklist. */
  hulpvragen: z.array(z.string().min(1)).default([]),
  geldt_als: z.enum(['altijd', 'grensoverschrijdend']),
  /**
   * Per kader de onderdelen waar dit aspect bij hoort. Een koppeling is een ID, of een ID met
   * een korte reden (`waarom`), zodat reviewers kunnen beoordelen of de koppeling klopt.
   */
  koppelingen: z.partialRecord(kaderIdSchema, z.array(koppelingSchema)),
});
export type Aspect = z.infer<typeof aspectSchema>;

export const themaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  titel: z.string().min(1),
  toelichting: z.string().optional(),
  volgorde: z.number().int(),
});
export type Thema = z.infer<typeof themaSchema>;
