import { html, nothing, type TemplateResult } from 'lit';
import { waarde } from './basis.ts';

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

/**
 * Eén keuze uit 2 tot 5 korte opties, op één rij (nldd-segmented-control), zoals de
 * ontwerprichtlijnen voorschrijven. Compacter dan radioknoppen onder elkaar, zodat de opties
 * zichtbaar bij hun vraag horen. Zonder voorselectie zolang er niets gekozen is.
 */
export function keuzeknoppen<T extends string>(
  o: Basis & { naam: string; waarde: T | null | undefined; opties: Record<T, string>; bij: (v: T) => void },
): TemplateResult {
  return html`
    <nldd-form-field label=${o.label} ?optional=${o.optioneel}>
      <nldd-segmented-control
        name=${o.naam}
        width="fit-content"
        .value=${o.waarde ?? ''}
        @change=${(e: Event) => {
          const v = waarde(e);
          if (v in o.opties) o.bij(v as T);
        }}
      >
        ${(Object.entries(o.opties) as [T, string][]).map(
          ([v, t]) => html`<nldd-segmented-control-item value=${v} text=${t}></nldd-segmented-control-item>`,
        )}
      </nldd-segmented-control>
      ${o.help ? html`<nldd-form-field-help-text>${o.help}</nldd-form-field-help-text>` : nothing}
    </nldd-form-field>
  `;
}

export const jaNee = { ja: 'Ja', nee: 'Nee' } as const;
