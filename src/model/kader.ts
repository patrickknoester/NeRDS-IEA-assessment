import { z } from 'zod';

/** De kaders die de tool kent. Elk kader staat in data/kaders/<id>.yaml. */
export const kaderIds = ['iea', 'eif', 'nerds', 'ado', 'gdi', 'nora'] as const;
export const kaderIdSchema = z.enum(kaderIds);
export type KaderId = z.infer<typeof kaderIdSchema>;

const slug = z.string().regex(/^[a-z0-9][a-z0-9./-]*$/, 'gebruik kleine letters, cijfers, punten, slashes en streepjes');

export const onderdeelStatusSchema = z.enum(['actueel', 'uitgefaseerd', 'concept']);

/** Eén onderdeel van een kader: een richtlijn, principe, aanbeveling, laag of artikel. */
export const kaderOnderdeelSchema = z.object({
  id: slug,
  titel: z.string().min(1),
  soort: z.string().min(1),
  samenvatting: z.string().optional(),
  bron: z.url(),
  status: onderdeelStatusSchema.default('actueel'),
  /** ID van het bovenliggende onderdeel binnen hetzelfde kader. */
  ouder: slug.optional(),
  /** ID's van gerelateerde onderdelen binnen hetzelfde kader. */
  relaties: z.array(slug).default([]),
});
export type KaderOnderdeel = z.infer<typeof kaderOnderdeelSchema>;

export const kaderSchema = z.object({
  id: kaderIdSchema,
  naam: z.string().min(1),
  afkorting: z.string().min(1),
  beschrijving: z.string().optional(),
  /** Versie van de bron: een releasetag, publicatiedatum of importdatum. */
  versie: z.string().min(1),
  bron: z.url(),
  licentie: z.string().optional(),
  /** Hoe dit bestand tot stand kwam, bijv. "scripts/import-nerds.ts" of "handmatig". */
  herkomst: z.string().min(1),
  onderdelen: z.array(kaderOnderdeelSchema).min(1),
});
export type Kader = z.infer<typeof kaderSchema>;

/** Verwijzing naar een kaderonderdeel van buiten het kader, bijv. "nerds:data". */
export type OnderdeelRef = `${KaderId}:${string}`;
export const onderdeelRef = (kader: KaderId, onderdeel: string): OnderdeelRef => `${kader}:${onderdeel}`;
