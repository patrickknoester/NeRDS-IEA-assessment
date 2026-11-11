import { html, nothing } from 'lit';
import type { Assessment } from '../model/assessment.ts';
import type { Voorbeeld } from '../data/catalogus.ts';
import { download } from './basis.ts';

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

          <nldd-banner
            variant="warning"
            text="Dit is een proof of concept, geen officiële dienst"
            supporting-text="De inhoud is een voorstel en nog niet getoetst door de beheerders van de kaders. Wat je invult blijft in je eigen browser: er gaat niets naar een server. Sla je werk op als bestand om het te bewaren of te delen."
          ></nldd-banner>

          <nldd-rich-text>
            <p>
              Je beschrijft per aspect wat de situatie is, welke opties je hebt bekeken, wat je hebt gekozen en waarom.
              Elk aspect is gekoppeld aan de kaders waar het bij hoort: NeRDS, NORA, de GDI-domeinarchitecturen, het
              EIF en, bij grensoverschrijdende diensten, de Interoperable Europe Act. Zo vul je niets dubbel in en zie
              je per kader wat je hebt behandeld.
            </p>
          </nldd-rich-text>

          ${o.fout ? html`<nldd-banner variant="critical" text="Dit bestand kan niet worden geopend" supporting-text=${o.fout}></nldd-banner>` : nothing}

          ${o.onleesbaar
            ? html`
                <nldd-banner
                  variant="critical"
                  text="Er staat een assessment in deze browser dat niet kan worden gelezen"
                  supporting-text="Misschien is het gemaakt met een andere versie van deze tool. Download het om de inhoud te bewaren, voordat je een nieuw assessment begint."
                >
                  <nldd-button slot="actions" start-icon="download" text="Download de inhoud" @click=${() => download('assessment-onleesbaar.json', o.onleesbaar!)}></nldd-button>
                </nldd-banner>
              `
            : nothing}

          ${o.bewaard
            ? html`
                <nldd-banner
                  variant="accent"
                  text="Je hebt een assessment in deze browser staan: ${naam}"
                  supporting-text="Begin je een nieuw assessment of open je een bestand, dan vervangt dat het assessment in deze browser. Sla het eerst op als bestand als je het wilt bewaren."
                >
                  <nldd-button slot="actions" appearance="primary" text="Verder met ${naam}" @click=${o.verder}></nldd-button>
                </nldd-banner>
              `
            : nothing}

          <nldd-button-group>
            <nldd-button appearance=${o.bewaard ? 'secondary' : 'primary'} text="Nieuw assessment" @click=${o.nieuw}></nldd-button>
          </nldd-button-group>

          <nldd-form-field label="Of open een opgeslagen assessment">
            <nldd-file-field
              variant="area"
              accept=".json,application/json"
              @change=${(e: CustomEvent<{ files: File[] }>) => {
                const f = e.detail?.files?.[0];
                if (f) o.openBestand(f);
              }}
            ></nldd-file-field>
          </nldd-form-field>
        </nldd-simple-section>

        ${o.voorbeelden.length
          ? html`<nldd-simple-section>
              <nldd-title
                slot="header"
                heading-level="2"
                text="Bekijk een voorbeeld"
                supporting-text="Een ingevuld assessment om te zien hoe het werkt. De feiten komen uit openbare bronnen; de uitvoering en keuzes zijn verzonnen."
              ></nldd-title>
              <nldd-list appearance="box-base" accessible-label="Voorbeelden">
                ${o.voorbeelden.map(
                  (v) => html`<nldd-list-item button @click=${() => o.openVoorbeeld(v)}>
                    <nldd-text-cell text=${v.titel} supporting-text=${v.beschrijving}></nldd-text-cell>
                    <nldd-icon-cell icon="chevron-right"></nldd-icon-cell>
                  </nldd-list-item>`,
                )}
              </nldd-list>
            </nldd-simple-section>`
          : nothing}

        <nldd-page-footer slot="footer"></nldd-page-footer>
      </nldd-page>
    </nldd-shell>
  `;
}
