import { html, nothing } from 'lit';
import type { Catalogus } from '../data/catalogus.ts';
import { eifLagen, ieaSchema, type Assessment } from '../model/assessment.ts';
import { beoordeelVerplichting } from '../model/beslisboom.ts';
import { link } from '../router.ts';
import type { Store } from '../state/store.ts';
import { lijstEditor } from './lijst-editor.ts';
import { effectTekst, laagTekst } from './teksten.ts';
import { keuzeknoppen, tekstveld } from './velden.ts';

type Iea = ReturnType<typeof ieaSchema.parse>;

export function ieaScherm(a: Assessment, c: Catalogus, s: Store) {
  if (a.context.grensoverschrijdend !== 'ja')
    return html`<nldd-simple-section>
      <nldd-inline-dialog text="De IEA-bijlage geldt alleen voor grensoverschrijdende diensten" supporting-text="Geef bij 'Over de dienst' aan dat de dienst grensoverschrijdend is.">
        <nldd-button slot="actions" text="Naar Over de dienst" href=${link.context}></nldd-button>
      </nldd-inline-dialog>
    </nldd-simple-section>`;

  const iea: Iea = a.iea ?? ieaSchema.parse({});
  const zet = (f: (x: Iea) => void) =>
    s.wijzig((x) => {
      x.iea ??= ieaSchema.parse({});
      f(x.iea);
    });
  const uitkomst = c.beslisboom ? beoordeelVerplichting(c.beslisboom, a.context.beslisboom) : undefined;
  const oplossingVelden = [
    { sleutel: 'naam', label: 'Naam', soort: 'tekst' },
    { sleutel: 'url', label: 'Link', soort: 'url', optioneel: true },
    { sleutel: 'toelichting', label: 'Hoe gebruik je deze oplossing?', soort: 'meerregelig', optioneel: true },
  ] as const;

  return html`
    <nldd-simple-section>
      <nldd-title
        id="hoofd-titel"
        slot="header"
        heading-level="1"
        overline="Interoperable Europe Act"
        text="IEA-bijlage"
        supporting-text="De minimale inhoud van het assessmentrapport volgens de bijlage bij de IEA. Komt als bijlage in het verantwoordingsrapport."
      ></nldd-title>

      ${uitkomst?.status === 'verplicht'
        ? html`<nldd-banner variant="warning" text="Het IEA-assessment is verplicht" supporting-text="Publiceer het rapport en deel het met de Interoperable Europe Board, bijvoorbeeld via het Interoperable Europe-portaal."></nldd-banner>`
        : uitkomst?.status === 'niet-verplicht'
          ? html`<nldd-banner variant="neutral" text="Vrijwillig assessment" supporting-text="Volgens de beslisboom is het IEA-assessment niet verplicht. Je kunt het wel invullen."></nldd-banner>`
          : html`<nldd-banner variant="neutral" text="Nog niet bekend of het assessment verplicht is" supporting-text="Beantwoord de beslisboom bij Over de dienst."></nldd-banner>`}

      <nldd-form name="iea" label-alignment="top" @submit=${(e: Event) => e.preventDefault()}>
        <nldd-form-section text="1. Algemene informatie" supporting-text="De organisatie komt uit Over de dienst.">
          ${tekstveld({ label: 'Initiatief, project of actie', meerregelig: true, regels: 2, waarde: iea.initiatief, bij: (v) => zet((x) => (x.initiatief = v)), help: 'Bijvoorbeeld een wetsvoorstel of aanbesteding, met een link als die er is.' })}
        </nldd-form-section>

        ${lijstEditor({
          titel: '2a. Beoordeelde bindende eisen',
          toelichting: 'Eisen die de keuzes van anderen beperken, en die nog niet besloten zijn.',
          itemNaam: 'Bindende eis',
          items: iea.bindendeEisen,
          velden: [
            { sleutel: 'omschrijving', label: 'Omschrijving', soort: 'meerregelig' },
            { sleutel: 'bron', label: 'Waar staat de eis?', soort: 'tekst', optioneel: true },
            { sleutel: 'gevoelig', label: 'Gevoelige informatie: niet opnemen in de openbare versie', soort: 'vinkje' },
          ],
          nieuw: () => ({ omschrijving: '', gevoelig: false }),
          bij: (items) => zet((x) => (x.bindendeEisen = items)),
        })}

        ${lijstEditor({
          titel: '2b. Betrokken trans-Europese digitale publieke diensten',
          itemNaam: 'Dienst',
          items: iea.diensten,
          velden: [
            { sleutel: 'naam', label: 'Naam', soort: 'tekst' },
            { sleutel: 'beschrijving', label: 'Beschrijving', soort: 'meerregelig', optioneel: true },
          ],
          nieuw: () => ({ naam: '', beschrijving: '' }),
          bij: (items) => zet((x) => (x.diensten = items)),
        })}

        ${lijstEditor({
          titel: '2c. Geraakte belanghebbenden',
          toelichting: 'Een categorie is genoeg, bijvoorbeeld "gemeenten" of "zorgverzekeraars".',
          itemNaam: 'Belanghebbende',
          items: iea.belanghebbenden,
          velden: [
            { sleutel: 'categorie', label: 'Categorie', soort: 'tekst' },
            { sleutel: 'sector', label: 'Sector', soort: 'keuze', opties: { publiek: 'Publiek', privaat: 'Privaat' } },
          ],
          nieuw: () => ({ categorie: '', sector: 'publiek' as const }),
          bij: (items) => zet((x) => (x.belanghebbenden = items)),
        })}

        <nldd-form-section
          text="2d. Effecten op grensoverschrijdende interoperabiliteit"
          supporting-text="Per laag van het EIF: is het effect van de eisen gunstig, verwaarloosbaar of risicovol?"
        >
          ${eifLagen.map(
            (laag) => html`
              ${keuzeknoppen({
                label: `${laagTekst[laag]} effect`,
                naam: `effect-${laag}`,
                waarde: iea.effecten[laag]?.oordeel,
                opties: effectTekst,
                bij: (v) => zet((x) => (x.effecten[laag] = { toelichting: '', ...x.effecten[laag], oordeel: v })),
              })}
              ${tekstveld({
                label: `Toelichting ${laagTekst[laag].toLowerCase()}`,
                optioneel: true,
                meerregelig: true,
                regels: 2,
                waarde: iea.effecten[laag]?.toelichting ?? '',
                bij: (v) => zet((x) => (x.effecten[laag] = { oordeel: null, ...x.effecten[laag], toelichting: v })),
              })}
            `,
          )}
        </nldd-form-section>

        ${lijstEditor({
          titel: '3a. Gebruikte Interoperable Europe-oplossingen',
          toelichting: 'Was er geen bruikbare oplossing, zet dat dan in de toelichting van een regel.',
          itemNaam: 'Oplossing',
          items: iea.ieOplossingen,
          velden: [...oplossingVelden],
          nieuw: () => ({ naam: '', toelichting: '' }),
          bij: (items) => zet((x) => (x.ieOplossingen = items)),
        })}

        ${lijstEditor({
          titel: '3b. Andere interoperabiliteitsoplossingen',
          toelichting: 'Bijvoorbeeld nationale standaarden of koppelvlakken.',
          itemNaam: 'Oplossing',
          items: iea.andereOplossingen,
          velden: [...oplossingVelden],
          nieuw: () => ({ naam: '', toelichting: '' }),
          bij: (items) => zet((x) => (x.andereOplossingen = items)),
        })}

        ${lijstEditor({
          titel: '3c. Resterende belemmeringen',
          itemNaam: 'Belemmering',
          items: iea.belemmeringen,
          velden: [
            { sleutel: 'omschrijving', label: 'Omschrijving', soort: 'meerregelig' },
            { sleutel: 'nodig', label: 'Wat is nodig om die weg te nemen?', soort: 'meerregelig', optioneel: true },
            { sleutel: 'gevoelig', label: 'Gevoelige informatie: niet opnemen in de openbare versie', soort: 'vinkje' },
          ],
          nieuw: () => ({ omschrijving: '', nodig: '', gevoelig: false }),
          bij: (items) => zet((x) => (x.belemmeringen = items)),
        })}

        ${lijstEditor({
          titel: 'Eerdere assessments',
          toelichting: 'Bouwt dit assessment voort op een eerder assessment, bijvoorbeeld van de EU-wet die je uitvoert?',
          itemNaam: 'Assessment',
          items: iea.eerdereAssessments,
          velden: [
            { sleutel: 'titel', label: 'Titel', soort: 'tekst' },
            { sleutel: 'url', label: 'Link', soort: 'url', optioneel: true },
          ],
          nieuw: () => ({ titel: '', soort: 'assessment' as const }),
          bij: (items) => zet((x) => (x.eerdereAssessments = items)),
        })}
        ${nothing}
      </nldd-form>
    </nldd-simple-section>
  `;
}
