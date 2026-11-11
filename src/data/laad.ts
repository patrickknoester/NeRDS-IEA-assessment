import { bouwCatalogus } from './catalogus.ts';

/** Alle YAML in data/, als tekst meegebundeld door Vite. */
const bestanden = import.meta.glob<string>('../../data/**/*.yaml', { query: '?raw', import: 'default', eager: true });

export const { catalogus, fouten } = bouwCatalogus(bestanden);

if (fouten.length > 0) {
  console.error('Fouten in data/:', fouten);
}
