import { z } from 'zod';

/** Kaders waarnaar een aspect kan verwijzen. De ID's in de lijsten komen uit data/kaders/<kader>.yaml. */
export const kaderIds = ['iea', 'eif', 'nerds', 'ado', 'gdi', 'nora'] as const;
export type KaderId = (typeof kaderIds)[number];

export const aspectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'gebruik kleine letters, cijfers en streepjes'),
  thema: z.string().min(1),
  titel: z.string().min(1),
  toelichting: z.string().min(1),
  geldt_als: z.enum(['altijd', 'grensoverschrijdend']),
  koppelingen: z.partialRecord(z.enum(kaderIds), z.array(z.string().min(1))),
});

export type Aspect = z.infer<typeof aspectSchema>;
