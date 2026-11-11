import { LitElement } from 'lit';

/**
 * Basis voor onze eigen elementen: light DOM, zodat de NLDD-componenten en de globale
 * stylesheet alles opmaken. Eigen elementen hebben geen eigen vormgeving.
 */
export class LightElement extends LitElement {
  protected createRenderRoot() {
    return this;
  }
}

/** Waarde uit een input- of change-event van een NLDD-veld. */
export function waarde(e: Event): string {
  const detail = (e as CustomEvent<{ value?: string }>).detail;
  return detail?.value ?? (e.target as HTMLInputElement | null)?.value ?? '';
}

/** Gekozen of niet, uit het change-event van een radio- of checkbox-veld. */
export function aangevinkt(e: Event): boolean {
  return Boolean((e as CustomEvent<{ checked?: boolean }>).detail?.checked);
}

/** Bied een tekst aan als bestand om te downloaden. */
export function download(naam: string, inhoud: string, type = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([inhoud], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = naam;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function bestandsnaam(dienst: string): string {
  const basis = dienst.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'assessment';
  return `${basis}-${new Date().toISOString().slice(0, 10)}.json`;
}
