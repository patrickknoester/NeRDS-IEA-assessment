import { html, nothing, type TemplateResult } from 'lit';
import { aangevinkt, waarde } from './basis.ts';

interface Basis {
  label: string;
  optioneel?: boolean;
  help?: string;
}

export function tekstveld(
  o: Basis & { waarde: string; bij: (v: string) => void; meerregelig?: boolean; type?: 'text' | 'url'; regels?: number },
): TemplateResult {
  return html`
    <nldd-form-field label=${o.label} ?optional=${o.optioneel}>
      ${o.meerregelig
        ? html`<nldd-multi-line-text-field
            rows=${o.regels ?? 3}
            .value=${o.waarde}
            @input=${(e: Event) => o.bij(waarde(e))}
          ></nldd-multi-line-text-field>`
        : html`<nldd-text-field
            type=${o.type ?? 'text'}
            .value=${o.waarde}
            @input=${(e: Event) => o.bij(waarde(e))}
          ></nldd-text-field>`}
      ${o.help ? html`<nldd-form-field-help-text>${o.help}</nldd-form-field-help-text>` : nothing}
    </nldd-form-field>
  `;
}

export function keuzeveld<T extends string>(
  o: Basis & { waarde: T | null; opties: Record<T, string>; bij: (v: T | null) => void; leegTekst?: string },
): TemplateResult {
  return html`
    <nldd-form-field label=${o.label} ?optional=${o.optioneel}>
      <nldd-dropdown>
        <select
          @change=${(e: Event) => {
            const v = (e.target as HTMLSelectElement).value;
            o.bij(v ? (v as T) : null);
          }}
        >
          <option value="" ?selected=${o.waarde == null}>${o.leegTekst ?? 'Maak een keuze'}</option>
          ${(Object.entries(o.opties) as [T, string][]).map(
            ([v, t]) => html`<option value=${v} ?selected=${o.waarde === v}>${t}</option>`,
          )}
        </select>
      </nldd-dropdown>
      ${o.help ? html`<nldd-form-field-help-text>${o.help}</nldd-form-field-help-text>` : nothing}
    </nldd-form-field>
  `;
}

/** Eén keuze uit een paar opties, als radioknoppen. */
export function radioveld<T extends string>(
  o: Basis & { naam: string; waarde: T | null | undefined; opties: Record<T, string>; bij: (v: T) => void },
): TemplateResult {
  return html`
    <nldd-form-field label=${o.label} ?optional=${o.optioneel}>
      <nldd-radio-button-group name=${o.naam}>
        ${(Object.entries(o.opties) as [T, string][]).map(
          ([v, t]) => html`<nldd-radio-button-field
            label=${t}
            value=${v}
            .checked=${o.waarde === v}
            @change=${(e: Event) => aangevinkt(e) && o.bij(v)}
          ></nldd-radio-button-field>`,
        )}
      </nldd-radio-button-group>
      ${o.help ? html`<nldd-form-field-help-text>${o.help}</nldd-form-field-help-text>` : nothing}
    </nldd-form-field>
  `;
}

export const jaNee = { ja: 'Ja', nee: 'Nee' } as const;
