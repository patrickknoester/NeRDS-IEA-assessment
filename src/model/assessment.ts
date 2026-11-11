import { z } from 'zod';
import { kaderIdSchema } from './kader.ts';
import { projectFaseSchema } from './hulpmiddel.ts';

/**
 * Het assessment zoals het wordt opgeslagen (autosave en JSON-bestand).
 * Verhoog SCHEMA_VERSIE bij een wijziging die oude bestanden breekt, en voeg een migratie toe.
 */
export const SCHEMA_VERSIE = 1;

const id = z.string().min(1);
const tijdstip = z.iso.datetime({ offset: true });

/** Wie iets heeft ingevuld. Nu optioneel; nodig zodra er meerdere invullers zijn. */
const auteurVelden = {
  gewijzigd: tijdstip,
  auteur: z.string().optional(),
};

/** Markeert informatie die niet in de publieke (IEA-)versie van het rapport mag. */
const gevoelig = z.boolean().default(false);

export const linkSchema = z.object({
  id,
  titel: z.string().min(1),
  url: z.url().optional(),
  soort: z.enum(['document', 'besluit', 'standaard', 'assessment', 'overig']).default('overig'),
});

export const risicoSchema = z.object({
  id,
  omschrijving: z.string().min(1),
  eigenaar: z.string().optional(),
  gevoelig,
});

export const relevantieSchema = z.enum(['open', 'van-toepassing', 'nvt']);

export const aspectAntwoordSchema = z
  .object({
    relevantie: relevantieSchema.default('open'),
    nvtReden: z.string().optional(),
    situatie: z.string().default(''),
    overweging: z.string().default(''),
    keuze: z.string().default(''),
    motivatie: z.string().default(''),
    risicos: z.array(risicoSchema).default([]),
    onderbouwing: z.array(linkSchema).default([]),
    ...auteurVelden,
  })
  .refine((a) => a.relevantie !== 'nvt' || (a.nvtReden ?? '').trim().length > 0, {
    message: 'Geef een reden als een aspect niet van toepassing is',
    path: ['nvtReden'],
  });
export type AspectAntwoord = z.infer<typeof aspectAntwoordSchema>;

export const jaNeeSchema = z.enum(['ja', 'nee']).nullable();

export const organisatieSoortSchema = z.enum([
  'rijk',
  'provincie',
  'gemeente',
  'waterschap',
  'zbo',
  'eu-instelling',
  'overig',
]);

export const betrokkeneSchema = z.object({
  id,
  naam: z.string().min(1),
  rol: z.string().min(1),
  organisatie: z.string().optional(),
});

export const contextSchema = z.object({
  dienst: z.string().default(''),
  doel: z.string().default(''),
  doelgroep: z.string().default(''),
  organisatie: z.object({
    naam: z.string().default(''),
    soort: organisatieSoortSchema.nullable().default(null),
  }),
  fase: projectFaseSchema.nullable().default(null),
  grensoverschrijdend: jaNeeSchema.default(null),
  /** Antwoorden op de IEA-beslisboom, per vraag-ID uit data/iea/beslisboom.yaml. */
  beslisboom: z.record(z.string(), jaNeeSchema).default({}),
  betrokkenen: z.array(betrokkeneSchema).default([]),
});
export type AssessmentContext = z.infer<typeof contextSchema>;

export const eifLagen = ['juridisch', 'organisatorisch', 'semantisch', 'technisch'] as const;
export const eifLaagSchema = z.enum(eifLagen);
export type EifLaag = z.infer<typeof eifLaagSchema>;

/** Effect op grensoverschrijdende interoperabiliteit, zoals de bijlage bij de IEA vraagt. */
export const effectOordeelSchema = z.enum(['beneficial', 'negligible', 'risky']).nullable();

export const oplossingSchema = z.object({
  id,
  naam: z.string().min(1),
  url: z.url().optional(),
  toelichting: z.string().default(''),
});

/** Gegevens voor de IEA-bijlage. Alleen in gebruik bij een grensoverschrijdende dienst. */
export const ieaSchema = z.object({
  initiatief: z.string().default(''),
  bindendeEisen: z.array(z.object({ id, omschrijving: z.string().min(1), bron: z.string().optional(), gevoelig })).default([]),
  diensten: z.array(z.object({ id, naam: z.string().min(1), beschrijving: z.string().default('') })).default([]),
  belanghebbenden: z
    .array(z.object({ id, categorie: z.string().min(1), sector: z.enum(['publiek', 'privaat']) }))
    .default([]),
  effecten: z
    .record(eifLaagSchema, z.object({ oordeel: effectOordeelSchema.default(null), toelichting: z.string().default('') }))
    .default({
      juridisch: { oordeel: null, toelichting: '' },
      organisatorisch: { oordeel: null, toelichting: '' },
      semantisch: { oordeel: null, toelichting: '' },
      technisch: { oordeel: null, toelichting: '' },
    }),
  ieOplossingen: z.array(oplossingSchema).default([]),
  andereOplossingen: z.array(oplossingSchema).default([]),
  belemmeringen: z
    .array(z.object({ id, omschrijving: z.string().min(1), nodig: z.string().default(''), gevoelig }))
    .default([]),
  eerdereAssessments: z.array(linkSchema).default([]),
});

export const assessmentSchema = z.object({
  schemaVersie: z.literal(SCHEMA_VERSIE),
  id,
  titel: z.string().default(''),
  aangemaakt: tijdstip,
  gewijzigd: tijdstip,
  /** Welke versie van elk kader gebruikt is, zodat oude rapporten geldig blijven. */
  kaderVersies: z.partialRecord(kaderIdSchema, z.string()),
  context: contextSchema,
  /** Antwoorden per aspect-ID. */
  antwoorden: z.record(z.string(), aspectAntwoordSchema).default({}),
  iea: ieaSchema.optional(),
});
export type Assessment = z.infer<typeof assessmentSchema>;
