import { html, nothing, type TemplateResult } from 'lit';
import type { Assessment } from '../model/assessment.ts';
import type { Voorbeeld } from '../data/catalogus.ts';
import { download } from './basis.ts';

/** Een kaart met een titel, een korte tekst en een actie onderaan (patroon "home"). */
function kaart(titel: string, tekst: string, actie: TemplateResult, extra: TemplateResult | typeof nothing = nothing) {
  return html`
    <nldd-card>
      <nldd-container padding="16">
        <nldd-title size="display-4" heading-level="3" text=${titel}></nldd-title>
        <nldd-spacer size="8"></nldd-spacer>
        <nldd-rich-text><p>${tekst}</p></nldd-rich-text>
        ${extra}
      </nldd-container>
      <nldd-container slot="footer" padding-inline="16" padding-bottom="16">${actie}</nldd-container>
    </nldd-card>
  `;
}

export function startScherm(o: {
  bewaard: Assessment | undefined;
  onleesbaar: string | undefined;
  fout: string | undefined;
  voorbeelden: Voorbeeld[];
  nieuw: () => void;
  openVoorbeeld: (v: Voorbeeld) => void;
  verder: () => void;
  openBestand: (f: File) => void;
}) {
  const naam = o.bewaard?.context.dienst.trim() || 'naamloos assessment';
  const vervangt = o.bewaard ? ' Dit vervangt het assessment dat nu in je browser staat.' : '';

  return html`
    <nldd-shell>
      <nldd-page>
        <nldd-skip-link slot="header">
          <nldd-top-navigation-bar
            website-title="Interoperabiliteitsassessment"
            logo-title="Nederlandse Digitale Dienst"
          ></nldd-top-navigation-bar>
        </nldd-skip-link>

        <nldd-simple-section>
          <nldd-title
            slot="header"
            heading-level="1"
            overline="Proof of concept"
            text="Verantwoord de keuzes voor je digitale dienst"
            supporting-text="Eén assessment voor de Nederlandse kaders en de Interoperable Europe Act."
          ></nldd-title>
          <nldd-container layout="stack" gap="24">
          <nldd-rich-text>
            <p>
              Je beschrijft per aspect wat de situatie is, welke opties je hebt bekeken, wat je hebt gekozen en waarom.
              Elk aspect is gekoppeld aan de kaders waar het bij hoort: NeRDS, NORA, de GDI-domeinarchitecturen, het
              EIF en, bij grensoverschrijdende diensten, de Interoperable Europe Act. Zo vul je niets dubbel in en zie
              je per kader wat je hebt behandeld.
            </p>
          </nldd-rich-text>
          <nldd-banner
            size="sm"
            variant="warning"
            text="Proof of concept, geen officiële dienst"
            supporting-text="De koppelingen tussen de kaders zijn een voorstel en nog niet getoetst. Wat je invult blijft in je eigen browser."
          ></nldd-banner>
          </nldd-container>
        </nldd-simple-section>

        <nldd-simple-section background="tinted">
          <nldd-title slot="header" heading-level="2" text="Aan de slag"></nldd-title>
          <nldd-container layout="stack" gap="24">

          ${o.fout
            ? html`<nldd-banner variant="critical" text="Dit bestand kan niet worden geopend" supporting-text=${o.fout}></nldd-banner>`
            : nothing}
          ${o.onleesbaar
            ? html`<nldd-banner
                variant="critical"
                text="Er staat een assessment in deze browser dat niet kan worden gelezen"
                supporting-text="Misschien is het gemaakt met een andere versie van deze tool. Download het om de inhoud te bewaren."
              >
                <nldd-button slot="actions" start-icon="download" text="Download de inhoud" @click=${() => download('assessment-onleesbaar.json', o.onleesbaar!)}></nldd-button>
              </nldd-banner>`
            : nothing}

          <nldd-collection layout="grid" item-min-width="280px">
            ${o.bewaard
              ? kaart(
                  'Verder waar je was',
                  `${naam}. Automatisch bewaard in deze browser.`,
                  html`<nldd-button appearance="primary" text="Verder" @click=${o.verder}></nldd-button>`,
                )
              : nothing}
            ${kaart(
              'Nieuw assessment',
              `Begin met een paar vragen over de dienst; die bepalen welke aspecten je te zien krijgt.${vervangt}`,
              html`<nldd-button appearance=${o.bewaard ? 'neutral-tinted' : 'primary'} text="Nieuw assessment" @click=${o.nieuw}></nldd-button>`,
            )}
            ${kaart(
              'Bestand openen',
              `Ga verder met een assessment dat je eerder als bestand hebt opgeslagen.${vervangt}`,
              html`<nldd-form-field label="Assessment (JSON)">
                <nldd-file-field
                  accept=".json,application/json"
                  @change=${(e: CustomEvent<{ files: File[] }>) => {
                    const f = e.detail?.files?.[0];
                    if (f) o.openBestand(f);
                  }}
                ></nldd-file-field>
              </nldd-form-field>`,
            )}
          </nldd-collection>
          </nldd-container>
        </nldd-simple-section>

        ${o.voorbeelden.length
          ? html`<nldd-simple-section>
              <nldd-title
                slot="header"
                heading-level="2"
                text="Bekijk een voorbeeld"
                supporting-text="Ingevulde assessments om te zien hoe het werkt. Ze zijn verzonnen; de bronnen staan erbij."
              ></nldd-title>
              <nldd-collection layout="grid" item-min-width="280px">
                ${o.voorbeelden.map((v) =>
                  kaart(
                    v.titel,
                    v.beschrijving,
                    html`<nldd-button appearance="neutral-tinted" text="Bekijk dit voorbeeld" @click=${() => o.openVoorbeeld(v)}></nldd-button>`,
                  ),
                )}
              </nldd-collection>
            </nldd-simple-section>`
          : nothing}

        <nldd-page-footer slot="footer"></nldd-page-footer>
      </nldd-page>
    </nldd-shell>
  `;
}
