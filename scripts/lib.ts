import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { stringify } from 'yaml';

export async function haal(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'iea-assessment-poc-import' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} bij ${url}`);
  return res.text();
}

export async function haalJson<T>(url: string): Promise<T> {
  return JSON.parse(await haal(url)) as T;
}

export function slugify(tekst: string): string {
  return tekst
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^\d+[.)]\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function schrijfYaml(pad: string, kop: string, data: unknown): void {
  mkdirSync(dirname(pad), { recursive: true });
  writeFileSync(pad, `# ${kop}\n# Niet met de hand bewerken: dit bestand wordt gegenereerd.\n${stringify(data, { lineWidth: 0 })}`);
  console.log(`geschreven: ${pad}`);
}
