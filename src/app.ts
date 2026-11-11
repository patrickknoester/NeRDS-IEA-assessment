import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { catalogus, fouten } from './data/laad.ts';
import { kaderVersies } from './data/catalogus.ts';
import { voortgangPerThema } from './model/voortgang.ts';
import { leesRoute, link, type Route } from './router.ts';
import { leesAssessment, nieuwAssessment, Store } from './state/store.ts';
import { aspectScherm } from './ui/aspect.ts';
import { bestandsnaam, download, LightElement } from './ui/basis.ts';
import { contextScherm } from './ui/context.ts';
import { ieaScherm } from './ui/iea.ts';
import { overzichtScherm } from './ui/overzicht.ts';
import { startScherm } from './ui/start.ts';
import { themaScherm } from './ui/thema.ts';
import { rapportScherm } from './ui/rapport.ts';

/** Root van de app. Light DOM, zodat de NLDD-shell de hele pagina beheert. */
@customElement('iea-app')
export class IeaApp extends LightElement {
  private readonly store = new Store();
  @state() private route: Route = leesRoute(location.hash);
  @state() private bestandsfout: string | undefined;
  /** Openbare versie van het rapport: zonder gevoelige onderdelen. */
  @state() private openbaar = false;
  /** Tijdens afdrukken laten we de bediening van het rapport weg; zo is er geen print-CSS nodig. */
  @state() private afdrukken = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.store.addEventListener('change', () => this.requestUpdate());
    window.addEventListener('hashchange', this.opHashWijziging);
    window.addEventListener('beforeprint', this.voorAfdrukken);
    window.addEventListener('afterprint', this.naAfdrukken);
    // Kom je terug met een link naar een scherm, ga dan verder met wat er bewaard is.
    const bewaard = this.store.bewaardeVersie();
    if (this.route.naam !== 'start' && bewaard) this.store.open(bewaard);
  }

  disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.opHashWijziging);
    window.removeEventListener('beforeprint', this.voorAfdrukken);
    window.removeEventListener('afterprint', this.naAfdrukken);
    super.disconnectedCallback();
  }

  private opHashWijziging = () => {
    this.route = leesRoute(location.hash);
    if (this.route.naam !== 'start' && !this.store.assessment) {
      const bewaard = this.store.bewaardeVersie();
      if (bewaard) this.store.open(bewaard);
    }
    // Nieuwe inhoud: begin bovenaan.
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  /** Wat `data-scheme` op <html> was vóór het afdrukken (licht/donker of niets). */
  private schemaVoorAfdrukken: string | null = null;

  private voorAfdrukken = () => {
    if (this.afdrukken) return;
    // Papier is wit: druk altijd af in het lichte schema, ook als het scherm donker is.
    this.schemaVoorAfdrukken = document.documentElement.getAttribute('data-scheme');
    document.documentElement.setAttribute('data-scheme', 'light');
    this.afdrukken = true;
    this.performUpdate(); // direct, vóór de browser de pagina opmaakt voor print
  };

  private naAfdrukken = () => {
    if (this.schemaVoorAfdrukken === null) document.documentElement.removeAttribute('data-scheme');
    else document.documentElement.setAttribute('data-scheme', this.schemaVoorAfdrukken);
    this.afdrukken = false;
  };

  private drukAf = () => {
    this.voorAfdrukken();
    window.print();
  };

  private ga(href: string) {
    if (location.hash === href) this.opHashWijziging();
    else location.hash = href;
  }

  private nieuw = () => {
    this.bestandsfout = undefined;
    this.store.open(nieuwAssessment(kaderVersies(catalogus)));
    this.ga(link.context);
  };

  private verder = () => {
    const bewaard = this.store.bewaardeVersie();
    if (bewaard) this.store.open(bewaard);
    this.ga(link.context);
  };

  private openBestand = async (bestand: File) => {
    const r = leesAssessment(await bestand.text());
    if (!r.ok) {
      this.bestandsfout = r.fout;
      return;
    }
    this.bestandsfout = undefined;
    this.store.open(r.assessment);
    this.ga(link.context);
  };

  private opslaan = () => {
    const a = this.store.assessment;
    if (a) download(bestandsnaam(a.context.dienst), this.store.alsJson());
  };

  private naarStart = () => {
    this.store.verlaat();
    this.ga(link.start);
  };

  render() {
    if (fouten.length) {
      return html`<nldd-shell><nldd-page><nldd-simple-section>
        <nldd-banner variant="critical" text="De kaderdata bevat fouten" supporting-text=${fouten.map((f) => `${f.bestand}: ${f.melding}`).join(' · ')}></nldd-banner>
      </nldd-simple-section></nldd-page></nldd-shell>`;
    }

    const a = this.store.assessment;
    if (!a || this.route.naam === 'start') {
      return startScherm({
        bewaard: this.store.bewaardeVersie(),
        onleesbaar: this.store.onleesbareVersie(),
        fout: this.bestandsfout,
        nieuw: this.nieuw,
        verder: this.verder,
        openBestand: this.openBestand,
      });
    }

    const r = this.route;
    if (r.naam === 'rapport') {
      // Het rapport staat los van de zijbalk, zodat het netjes afdrukt.
      return rapportScherm(a, catalogus, {
        openbaar: this.openbaar,
        afdrukken: this.afdrukken,
        zetOpenbaar: (v) => (this.openbaar = v),
        opslaan: this.opslaan,
        drukAf: this.drukAf,
      });
    }
    const perThema = voortgangPerThema(catalogus, a);
    const huidigThema =
      r.naam === 'thema' ? r.id : r.naam === 'aspect' ? catalogus.aspecten.find((x) => x.id === r.id)?.thema : undefined;
    const titel =
      r.naam === 'context'
        ? 'Over de dienst'
        : r.naam === 'iea'
          ? 'IEA-bijlage'
          : r.naam === 'overzicht'
            ? 'Voortgang en dekking'
            : r.naam === 'thema'
              ? (catalogus.themas.find((t) => t.id === r.id)?.titel ?? 'Thema')
              : (catalogus.aspecten.find((x) => x.id === r.id)?.titel ?? 'Aspect');
    const dienst = a.context.dienst.trim() || 'Nieuw assessment';
    const grens = a.context.grensoverschrijdend === 'ja';

    return html`
      <nldd-shell>
        <nldd-navigation-split-view>
          <nldd-split-view-pane slot="primary-sidebar">
            <nldd-page accessible-label="Onderdelen van het assessment" sticky-header>
              <nldd-top-title-bar slot="header" text=${dienst} heading-level="2" collapse-anchor="zijbalk-titel"></nldd-top-title-bar>
              <nldd-simple-section>
                <nldd-title id="zijbalk-titel" slot="header" size="display-4" heading-level="2" overline="Assessment" text=${dienst}></nldd-title>
                <nldd-list type="navigation" accessible-label="Onderdelen van het assessment">
                  <nldd-list-item href=${link.context} ?current=${r.naam === 'context'}>
                    <nldd-text-cell text="Over de dienst"></nldd-text-cell>
                  </nldd-list-item>
                  ${catalogus.themas.map((t) => {
                    const v = perThema.get(t.id)!;
                    return html`<nldd-list-item href=${link.thema(t.id)} ?current=${huidigThema === t.id}>
                      <nldd-text-cell text=${t.titel} supporting-text="${v.behandeld + v.nvt} van ${v.totaal} klaar"></nldd-text-cell>
                    </nldd-list-item>`;
                  })}
                  ${grens
                    ? html`<nldd-list-item href=${link.iea} ?current=${r.naam === 'iea'}>
                        <nldd-text-cell text="IEA-bijlage"></nldd-text-cell>
                      </nldd-list-item>`
                    : nothing}
                  <nldd-list-item href=${link.overzicht} ?current=${r.naam === 'overzicht'}>
                    <nldd-text-cell text="Voortgang en dekking"></nldd-text-cell>
                  </nldd-list-item>
                  <nldd-list-item href=${link.rapport}>
                    <nldd-text-cell text="Rapport" supporting-text="Bekijken, afdrukken of exporteren"></nldd-text-cell>
                  </nldd-list-item>
                </nldd-list>
                <nldd-container slot="footer" layout="stack" gap="8">
                  <nldd-text size="sm" color="secondary">
                    ${this.store.bewaard ? 'Automatisch bewaard in deze browser.' : 'Automatisch bewaren in de browser lukt niet. Sla je werk op als bestand.'}
                  </nldd-text>
                  <nldd-button-group>
                    <nldd-button appearance="secondary" start-icon="download" text="Opslaan als bestand" @click=${this.opslaan}></nldd-button>
                    <nldd-button appearance="neutral-transparent" text="Naar het begin" @click=${this.naarStart}></nldd-button>
                  </nldd-button-group>
                </nldd-container>
              </nldd-simple-section>
            </nldd-page>
          </nldd-split-view-pane>

          <nldd-split-view-pane slot="main" has-content>
            ${keyed(
              location.hash,
              // Een nieuwe pagina per scherm, zodat elk scherm bovenaan begint.
              html`<nldd-page landmarks="page" sticky-header>
                <nldd-top-title-bar slot="header" text=${titel} back-text=${dienst} collapse-anchor="hoofd-titel"></nldd-top-title-bar>
                ${this.scherm(r)}
              </nldd-page>`,
            )}
          </nldd-split-view-pane>
        </nldd-navigation-split-view>
      </nldd-shell>
    `;
  }

  private scherm(r: Route) {
    const a = this.store.assessment!;
    switch (r.naam) {
      case 'thema':
        return themaScherm(r.id, a, catalogus);
      case 'aspect':
        return aspectScherm(r.id, a, catalogus, this.store);
      case 'iea':
        return ieaScherm(a, catalogus, this.store);
      case 'overzicht':
        return overzichtScherm(a, catalogus, this.opslaan);
      default:
        return contextScherm(a, catalogus, this.store);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'iea-app': IeaApp;
  }
}
