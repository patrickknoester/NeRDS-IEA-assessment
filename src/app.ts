import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

/** Root van de app. Light DOM, zodat de NLDD-shell de hele pagina beheert. */
@customElement('iea-app')
export class IeaApp extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <nldd-shell>
        <nldd-page>
          <nldd-top-navigation-bar
            slot="header"
            website-title="Interoperabiliteitsassessment"
            logo-title="Nederlandse Digitale Dienst"
          ></nldd-top-navigation-bar>

          <nldd-simple-section>
            <nldd-title
              slot="header"
              heading-level="1"
              overline="Proof of concept"
              text="Verantwoord de keuzes voor je digitale dienst"
              supporting-text="Eén assessment voor de Nederlandse kaders en de Interoperable Europe Act."
            ></nldd-title>
            <nldd-rich-text>
              <p>
                Je beantwoordt per aspect wat de situatie is, welke opties je hebt bekeken en wat je
                hebt gekozen en waarom. De uitkomst is een verantwoordingsrapport dat laat zien welke
                kaders je hebt behandeld: NeRDS, NORA, ADO, de GDI-domeinarchitecturen, het EIF en,
                bij grensoverschrijdende diensten, de IEA.
              </p>
            </nldd-rich-text>
            <nldd-container slot="footer" layout="wrap" gap="12">
              <nldd-button appearance="accent-filled" text="Nieuwe assessment" disabled></nldd-button>
              <nldd-button text="Voorbeeld bekijken" disabled></nldd-button>
            </nldd-container>
          </nldd-simple-section>

          <nldd-page-footer slot="footer"></nldd-page-footer>
        </nldd-page>
      </nldd-shell>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'iea-app': IeaApp;
  }
}
