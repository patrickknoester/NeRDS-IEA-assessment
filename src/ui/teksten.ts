import type { AspectStatus, DekkingStatus } from '../model/voortgang.ts';

export const statusTekst: Record<AspectStatus | DekkingStatus, string> = {
  open: 'Open',
  bezig: 'Bezig',
  behandeld: 'Behandeld',
  nvt: 'Niet van toepassing',
};

export const faseTekst = {
  verkenning: 'Verkenning',
  ontwerp: 'Ontwerp',
  bouw: 'Bouw',
  productie: 'Productie',
  live: 'Live en beheer',
} as const;

export const organisatieTekst = {
  rijk: 'Rijksoverheid',
  provincie: 'Provincie',
  gemeente: 'Gemeente',
  waterschap: 'Waterschap',
  zbo: 'Zelfstandig bestuursorgaan',
  'eu-instelling': 'EU-instelling',
  overig: 'Andere organisatie',
} as const;

export const effectTekst = {
  beneficial: 'Gunstig',
  negligible: 'Verwaarloosbaar',
  risky: 'Risicovol',
} as const;

export const laagTekst = {
  juridisch: 'Juridisch',
  organisatorisch: 'Organisatorisch',
  semantisch: 'Semantisch',
  technisch: 'Technisch',
} as const;
