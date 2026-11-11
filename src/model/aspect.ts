import { z } from 'zod';
import { kaderIdSchema } from './kader.ts';

export const aspectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'gebruik kleine letters, cijfers en streepjes'),
  thema: z.string().min(1),
  titel: z.string().min(1),
  toelichting: z.string().min(1),
  geldt_als: z.enum(['altijd', 'grensoverschrijdend']),
  /** Per kader de ID's van de onderdelen waar dit aspect bij hoort. */
  koppelingen: z.partialRecord(kaderIdSchema, z.array(z.string().min(1))),
});
export type Aspect = z.infer<typeof aspectSchema>;

export const themaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  titel: z.string().min(1),
  toelichting: z.string().optional(),
  volgorde: z.number().int(),
});
export type Thema = z.infer<typeof themaSchema>;
