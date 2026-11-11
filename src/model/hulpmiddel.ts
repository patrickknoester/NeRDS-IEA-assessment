import { z } from 'zod';

export const projectFases = ['verkenning', 'ontwerp', 'bouw', 'productie', 'live'] as const;
export const projectFaseSchema = z.enum(projectFases);
export type ProjectFase = z.infer<typeof projectFaseSchema>;

/** Een hulpmiddel (tool, register, handreiking), bijv. uit de NeRDS action registry. */
export const hulpmiddelSchema = z.object({
  id: z.string().min(1),
  naam: z.string().min(1),
  beschrijving: z.string(),
  bron: z.url().nullable(),
  /** Verwijzingen naar kaderonderdelen, bijv. "nerds:cloud". */
  onderdelen: z.array(z.string().regex(/^[a-z]+:.+$/)).min(1),
  /** Leeg betekent: in elke fase bruikbaar. */
  fases: z.array(projectFaseSchema).default([]),
  status: z.enum(['beschikbaar', 'concept', 'ontwikkeling']),
});
export type Hulpmiddel = z.infer<typeof hulpmiddelSchema>;

export const hulpmiddelenBestandSchema = z.object({
  herkomst: z.string(),
  versie: z.string(),
  hulpmiddelen: z.array(hulpmiddelSchema),
});
