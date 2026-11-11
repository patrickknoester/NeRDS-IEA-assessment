import { html, nothing } from 'lit';
import type { Catalogus } from '../data/catalogus.ts';
import type { Assessment } from '../model/assessment.ts';
import { beoordeelVerplichting } from '../model/beslisboom.ts';
import { projectFases } from '../model/hulpmiddel.ts';
import type { Store } from '../state/store.ts';
import { lijstEditor } from './lijst-editor.ts';
import { faseTekst, organisatieTekst } from './teksten.ts';
import { jaNee, keuzeveld, keuzeknoppen, tekstveld } from './velden.ts';
import { link } from '../router.ts';
import { voorbeeldMelding } from './voorbeeld.ts';

export function contextScherm(a: Assessment, c: Catalogus, s: Store) {
  const ctx = a.context;
  const zet = (f: (x: Assessment['context']) => void) => s.wijzig((x) => f(x.context));
  const boom = c.beslisboom;
  const uitkomst = boom ? beoordeelVerplichting(boom, ctx.beslisboom) : undefined;
  // Toon de vragen tot en met de eerste onbeantwoorde of de eerste "nee".
  const zichtbareVragen = boom
    ? boom.vragen.slice(0, boom.vragen.findIndex((v) => ctx.beslisboom[v.id] !== 'ja') + 1 || boom.vragen.length)
    : [];

  return html`
    <nldd-simple-section>
      <nldd-title
        id="hoofd-titel"
        slot="header"
        heading-level="1"
        text="Over de dienst"
        supporting-text="Deze antwoorden bepalen welke aspecten je te zien krijgt, en vormen het begin van het rapport."
      ></nldd-title>

      <nldd-container layout="stack" gap="24">
      ${voorbeeldMelding(a)}

      <nldd-form name="context" label-alignment="top" @submit=${(e: Event) => e.preventDefault()}>
        <nldd-form-section text="De dienst of het project">
          ${tekstveld({ label: 'Naam van de dienst of het project', waarde: ctx.dienst, bij: (v) => zet((x) => (x.dienst = v)) })}
          ${tekstveld({ label: 'Doel', meerregelig: true, waarde: ctx.doel, bij: (v) => zet((x) => (x.doel = v)), help: 'Wat moet de dienst opleveren, en voor wie?' })}
          ${tekstveld({ label: 'Doelgroep', meerregelig: true, regels: 2, waarde: ctx.doelgroep, bij: (v) => zet((x) => (x.doelgroep = v)) })}
          ${keuzeveld({
            label: 'Fase',
            waarde: ctx.fase,
            opties: Object.fromEntries(projectFases.map((f) => [f, faseTekst[f]])) as typeof faseTekst,
            bij: (v) => zet((x) => (x.fase = v)),
            help: 'Bij elk aspect tonen we de hulpmiddelen uit NeRDS die bij deze fase passen.',
          })}
        </nldd-form-section>

        <nldd-form-section text="De organisatie">
          ${tekstveld({ label: 'Naam van de organisatie', waarde: ctx.organisatie.naam, bij: (v) => zet((x) => (x.organisatie.naam = v)) })}
          ${keuzeveld({ label: 'Soort organisatie', waarde: ctx.organisatie.soort, opties: organisatieTekst, bij: (v) => zet((x) => (x.organisatie.soort = v)) })}
        </nldd-form-section>

        <nldd-form-section
          text="Grensoverschrijdend"
          supporting-text="Een dienst is grensoverschrijdend als systemen samenwerken met overheden in andere EU-lidstaten of met EU-instellingen."
        >
          ${keuzeknoppen({
            label: 'Is de dienst grensoverschrijdend?',
            naam: 'grensoverschrijdend',
            waarde: ctx.grensoverschrijdend,
            opties: jaNee,
            bij: (v) => zet((x) => (x.grensoverschrijdend = v)),
            help: 'Bij "ja" komen er drie aspecten en de IEA-bijlage bij.',
          })}
        </nldd-form-section>

        ${ctx.grensoverschrijdend === 'ja' && boom
          ? html`
              <nldd-form-section
                text="Is het IEA-assessment verplicht?"
                supporting-text="De beslisboom uit de richtlijnen bij de Interoperable Europe Act. Bij het eerste nee ben je klaar."
              >
                ${zichtbareVragen.map((v, i) =>
                  keuzeknoppen({
                    label: `${i + 1}. ${v.vraag}`,
                    naam: `beslisboom-${v.id}`,
                    waarde: ctx.beslisboom[v.id],
                    opties: jaNee,
                    bij: (w) => zet((x) => (x.beslisboom = { ...x.beslisboom, [v.id]: w })),
                  }),
                )}
                ${uitkomst?.status === 'verplicht'
                  ? html`<nldd-banner variant="warning" text="Het IEA-assessment is verplicht" supporting-text=${boom.uitkomst_verplicht}></nldd-banner>`
                  : uitkomst?.status === 'niet-verplicht'
                    ? html`<nldd-banner variant="neutral" text="Het IEA-assessment is niet verplicht" supporting-text="${uitkomst.reden} ${boom.uitkomst_niet_verplicht}"></nldd-banner>`
                    : nothing}
                <nldd-text size="sm" color="secondary">Bron: <nldd-link href=${boom.bron} target="_blank" text="IEA-richtlijnen, hoofdstuk 2"></nldd-link></nldd-text>
              </nldd-form-section>
            `
          : nothing}

        ${lijstEditor({
          titel: 'Betrokkenen',
          toelichting: 'Wie hebben aan dit assessment meegewerkt? Komt in de verantwoording van het rapport.',
          itemNaam: 'Betrokkene',
          items: ctx.betrokkenen,
          velden: [
            { sleutel: 'naam', label: 'Naam', soort: 'tekst' },
            { sleutel: 'rol', label: 'Rol', soort: 'tekst' },
            { sleutel: 'organisatie', label: 'Organisatie', soort: 'tekst', optioneel: true },
          ],
          nieuw: () => ({ naam: '', rol: '' }),
          bij: (items) => zet((x) => (x.betrokkenen = items)),
        })}

        <nldd-form-actions>
          <nldd-button-group>
            <nldd-button appearance="primary" end-icon="arrow-right" text="Naar het eerste thema" href=${link.thema(c.themas[0]?.id ?? '')}></nldd-button>
          </nldd-button-group>
        </nldd-form-actions>
      </nldd-form>
      </nldd-container>
    </nldd-simple-section>
  `;
}
