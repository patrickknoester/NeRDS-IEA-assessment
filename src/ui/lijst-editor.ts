import { html, type TemplateResult } from 'lit';
import { nieuwId } from '../state/store.ts';
import { aangevinkt } from './basis.ts';
import { keuzeveld, tekstveld } from './velden.ts';

export type Veld =
  | { sleutel: string; label: string; soort: 'tekst' | 'url' | 'meerregelig'; optioneel?: boolean }
  | { sleutel: string; label: string; soort: 'keuze'; opties: Record<string, string>; optioneel?: boolean }
  | { sleutel: string; label: string; soort: 'vinkje' };

type Item = { id: string } & Record<string, unknown>;

/**
 * Een herhaalbare lijst (risico's, links, bindende eisen …): per item een kader met velden
 * en een knop om het te verwijderen, en onderaan een knop om er een toe te voegen.
 */
export function lijstEditor<T extends Item>(o: {
  titel: string;
  toelichting?: string;
  itemNaam: string;
  items: T[];
  velden: Veld[];
  nieuw: () => Omit<T, 'id'>;
  bij: (items: T[]) => void;
}): TemplateResult {
  const zet = (index: number, sleutel: string, v: unknown) =>
    o.bij(o.items.map((it, i) => (i === index ? { ...it, [sleutel]: v } : it)));

  return html`
    <nldd-form-section text=${o.titel} supporting-text=${o.toelichting ?? ''}>
      ${o.items.map(
        (item, i) => html`
          <nldd-box>
            <nldd-container layout="stack" gap="12" padding="16">
              ${o.velden.map((v) => {
                const w = item[v.sleutel];
                switch (v.soort) {
                  case 'vinkje':
                    return html`<nldd-checkbox-field
                      label=${v.label}
                      .checked=${Boolean(w)}
                      @change=${(e: Event) => zet(i, v.sleutel, aangevinkt(e))}
                    ></nldd-checkbox-field>`;
                  case 'keuze':
                    return keuzeveld({
                      label: v.label,
                      optioneel: v.optioneel,
                      waarde: (w as string | undefined) ?? null,
                      opties: v.opties,
                      bij: (x) => zet(i, v.sleutel, x ?? undefined),
                    });
                  default:
                    return tekstveld({
                      label: v.label,
                      optioneel: v.optioneel,
                      waarde: (w as string | undefined) ?? '',
                      meerregelig: v.soort === 'meerregelig',
                      regels: 2,
                      type: v.soort === 'url' ? 'url' : 'text',
                      bij: (x) => zet(i, v.sleutel, v.soort === 'url' && !x ? undefined : x),
                    });
                }
              })}
              <nldd-button-group>
                <nldd-button
                  appearance="critical-transparent"
                  start-icon="trash"
                  size="sm"
                  text="${o.itemNaam} verwijderen"
                  @click=${() => o.bij(o.items.filter((_, j) => j !== i))}
                ></nldd-button>
              </nldd-button-group>
            </nldd-container>
          </nldd-box>
        `,
      )}
      <nldd-button-group>
        <nldd-button
          appearance="secondary"
          start-icon="plus"
          text="${o.itemNaam} toevoegen"
          @click=${() => o.bij([...o.items, { id: nieuwId(), ...o.nieuw() } as T])}
        ></nldd-button>
      </nldd-button-group>
    </nldd-form-section>
  `;
}
