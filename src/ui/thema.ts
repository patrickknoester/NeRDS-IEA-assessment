import { html } from 'lit';
import type { Catalogus } from '../data/catalogus.ts';
import type { Assessment } from '../model/assessment.ts';
import { aspectStatus, zichtbareAspecten } from '../model/voortgang.ts';
import { link } from '../router.ts';
import { statusTekst } from './teksten.ts';

export function themaScherm(themaId: string, a: Assessment, c: Catalogus) {
  const thema = c.themas.find((t) => t.id === themaId);
  if (!thema) return html`<nldd-simple-section><nldd-inline-dialog text="Dit thema bestaat niet"></nldd-inline-dialog></nldd-simple-section>`;
  const aspecten = zichtbareAspecten(c, a).filter((x) => x.thema === thema.id);
  return html`
    <nldd-simple-section>
      <nldd-title id="hoofd-titel" slot="header" heading-level="1" overline="Thema" text=${thema.titel} supporting-text=${thema.toelichting ?? ''}></nldd-title>
      <nldd-list appearance="box-base" accessible-label="Aspecten van ${thema.titel}">
        ${aspecten.map(
          (x) => html`
            <nldd-list-item href=${link.aspect(x.id)}>
              <nldd-text-cell
                overline=${statusTekst[aspectStatus(a.antwoorden[x.id])] + (x.geldt_als === 'grensoverschrijdend' ? ' · grensoverschrijdend' : '')}
                text=${x.titel}
                supporting-text=${x.toelichting}
              ></nldd-text-cell>
              <nldd-icon-cell icon="chevron-right"></nldd-icon-cell>
            </nldd-list-item>
          `,
        )}
      </nldd-list>
    </nldd-simple-section>
  `;
}
