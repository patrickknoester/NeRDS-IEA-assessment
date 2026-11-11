import type { Catalogus } from '../data/catalogus.ts';
import type { Assessment } from './assessment.ts';
import { bouwRapport, geldigeUrl } from './rapport.ts';

export const IEA_EXPORT_FORMAAT = 'iea-assessment-poc/annex/v0';

/**
 * Machine-leesbare versie van de IEA-bijlage (Verordening (EU) 2024/903, bijlage).
 * Voorlopig formaat: de opbouw volgt de bijlage, de veldnamen zijn Engels zodat het aansluit op
 * Europese tooling. Het datamodel van de Commissie is aangekondigd maar nog niet gepubliceerd;
 * zodra het er is, nemen we dat over. Gevoelige onderdelen gaan er nooit in mee.
 */
export function ieaExport(c: Catalogus, a: Assessment, nu = new Date()) {
  const r = bouwRapport(c, a, { openbaar: true }, nu);
  if (!r.iea) return undefined;
  const { data, verplichting } = r.iea;
  const effect = (l: keyof typeof data.effecten) => ({
    assessment: data.effecten[l]?.oordeel ?? null,
    explanation: data.effecten[l]?.toelichting || null,
  });
  const oplossing = (x: (typeof data.ieOplossingen)[number]) => ({
    name: x.naam,
    url: geldigeUrl(x.url) ?? null,
    description: x.toelichting || null,
  });
  return {
    format: IEA_EXPORT_FORMAAT,
    legalBasis: 'Regulation (EU) 2024/903, Article 3 and Annex',
    language: 'nl',
    mandatory: verplichting?.status === 'verplicht' ? true : verplichting?.status === 'niet-verplicht' ? false : null,
    generalInformation: {
      publicSectorBody: { name: a.context.organisatie.naam || null, type: a.context.organisatie.soort },
      initiative: data.initiatief || null,
      service: a.context.dienst || null,
    },
    requirements: {
      transEuropeanDigitalPublicServices: data.diensten.map((d) => ({ name: d.naam, description: d.beschrijving || null })),
      bindingRequirements: data.bindendeEisen.map((e) => ({ description: e.omschrijving, source: e.bron || null })),
      stakeholders: data.belanghebbenden.map((b) => ({ category: b.categorie, sector: b.sector === 'publiek' ? 'public' : 'private' })),
      effectsOnCrossBorderInteroperability: {
        legal: effect('juridisch'),
        organisational: effect('organisatorisch'),
        semantic: effect('semantisch'),
        technical: effect('technisch'),
      },
    },
    results: {
      interoperableEuropeSolutions: data.ieOplossingen.map(oplossing),
      otherInteroperabilitySolutions: data.andereOplossingen.map(oplossing),
      remainingBarriers: data.belemmeringen.map((b) => ({ description: b.omschrijving, needed: b.nodig || null })),
    },
    relatedAssessments: data.eerdereAssessments.map((x) => ({ title: x.titel, url: geldigeUrl(x.url) ?? null })),
    metadata: {
      assessmentId: a.id,
      generatedAt: nu.toISOString(),
      lastModified: a.gewijzigd,
      frameworkVersions: a.kaderVersies,
      redactedItems: r.weggelaten,
    },
  };
}
