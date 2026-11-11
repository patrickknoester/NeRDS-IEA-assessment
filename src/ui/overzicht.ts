import { html } from 'lit';
import type { Catalogus } from '../data/catalogus.ts';
import type { Assessment } from '../model/assessment.ts';
import { dekkingPerKader, voortgangPerThema } from '../model/voortgang.ts';
import { link } from '../router.ts';
import { statusTekst } from './teksten.ts';

export function overzichtScherm(a: Assessment, c: Catalogus, opslaan: () => void) {
  const perThema = voortgangPerThema(c, a);
  const dekking = dekkingPerKader(c, a);

  return html`
    <nldd-simple-section>
      <nldd-title
        id="hoofd-titel"
        slot="header"
        heading-level="1"
        text="Voortgang en dekking"
        supporting-text="Een aspect is klaar als het behandeld is, of niet van toepassing met een reden."
      ></nldd-title>
      <nldd-container layout="stack" gap="16">
      ${c.themas.map((t) => {
        const v = perThema.get(t.id)!;
        return html`<nldd-progress-bar text=${t.titel} value=${v.behandeld + v.nvt} max=${v.totaal} value-format="fraction"></nldd-progress-bar>`;
      })}
      <nldd-button-group>
        <nldd-button appearance="primary" start-icon="document" text="Rapport bekijken" href=${link.rapport}></nldd-button>
        <nldd-button appearance="secondary" start-icon="download" text="Opslaan als bestand" @click=${opslaan}></nldd-button>
      </nldd-button-group>
      </nldd-container>
    </nldd-simple-section>

    ${[...dekking.entries()].map(([k, rijen]) => {
      const kader = c.kaders.get(k)!;
      const klaar = rijen.filter((r) => r.status !== 'open').length;
      return html`
        <nldd-simple-section>
          <nldd-title slot="header" heading-level="2" text=${kader.naam} supporting-text="${kader.afkorting} ${kader.versie} · ${klaar} van ${rijen.length} gekoppelde onderdelen behandeld"></nldd-title>
          <nldd-list appearance="box-base" accessible-label="Dekking ${kader.afkorting}">
            ${rijen.map(
              (r) => html`<nldd-list-item href=${link.aspect(r.aspecten[0])}>
                <nldd-text-cell
                  overline=${statusTekst[r.status]}
                  text=${r.titel}
                  supporting-text="Via ${r.aspecten.length === 1 ? 'aspect' : 'aspecten'}: ${r.aspecten.map((id) => c.aspecten.find((x) => x.id === id)?.titel ?? id).join(', ')}"
                ></nldd-text-cell>
              </nldd-list-item>`,
            )}
          </nldd-list>
        </nldd-simple-section>
      `;
    })}
  `;
}
