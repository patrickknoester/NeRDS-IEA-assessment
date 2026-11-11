import { html, nothing } from 'lit';
import type { Catalogus } from '../data/catalogus.ts';
import type { Assessment } from '../model/assessment.ts';
import { kaderIds } from '../model/kader.ts';
import { zichtbareAspecten } from '../model/voortgang.ts';
import { link } from '../router.ts';
import type { Store } from '../state/store.ts';
import { lijstEditor } from './lijst-editor.ts';
import { keuzeknoppen, tekstveld } from './velden.ts';
import { waarde } from './basis.ts';

export function aspectScherm(aspectId: string, a: Assessment, c: Catalogus, s: Store) {
  const zichtbaar = zichtbareAspecten(c, a);
  const index = zichtbaar.findIndex((x) => x.id === aspectId);
  const aspect = zichtbaar[index];
  if (!aspect)
    return html`<nldd-simple-section><nldd-inline-dialog text="Dit aspect is niet beschikbaar" supporting-text="Het bestaat niet, of het geldt alleen voor grensoverschrijdende diensten."></nldd-inline-dialog></nldd-simple-section>`;

  const thema = c.themas.find((t) => t.id === aspect.thema);
  const antwoord = a.antwoorden[aspect.id];
  const zet = (f: (x: NonNullable<typeof antwoord>) => void) => s.wijzigAntwoord(aspect.id, f);
  const volgende = zichtbaar[index + 1];
  const relevantie = antwoord?.relevantie ?? 'open';

  // Hulpmiddelen uit NeRDS bij de gekoppelde richtlijnen, passend bij de fase.
  const nerdsIds = new Set((aspect.koppelingen.nerds ?? []).map((k) => `nerds:${k.id}`));
  const fase = a.context.fase;
  const hulpmiddelen = c.hulpmiddelen.filter(
    (h) => h.bron && h.onderdelen.some((o) => nerdsIds.has(o)) && (!fase || !h.fases.length || h.fases.includes(fase)),
  );

  return html`
    <nldd-simple-section>
      <nldd-title id="hoofd-titel" slot="header" heading-level="1" overline=${thema?.titel ?? ''} text=${aspect.titel} supporting-text=${aspect.toelichting}></nldd-title>

      <nldd-container layout="stack" gap="24">
      ${aspect.hulpvragen.length
        ? html`<nldd-box>
            <nldd-container padding="16">
              <nldd-rich-text>
                <p><strong>Om over na te denken</strong></p>
                <ul>
                  ${aspect.hulpvragen.map((v) => html`<li>${v}</li>`)}
                </ul>
              </nldd-rich-text>
            </nldd-container>
          </nldd-box>`
        : nothing}

      <nldd-form name="aspect" label-alignment="top" @submit=${(e: Event) => e.preventDefault()}>
        <nldd-form-section text="Relevantie">
          ${keuzeknoppen({
            label: 'Is dit aspect van toepassing op de dienst?',
            naam: `relevantie-${aspect.id}`,
            waarde: relevantie === 'open' ? null : relevantie,
            opties: { 'van-toepassing': 'Van toepassing', nvt: 'Niet van toepassing' },
            bij: (v) => zet((x) => (x.relevantie = v)),
          })}
          ${relevantie === 'nvt'
            ? html`
                <nldd-form-field label="Waarom is dit aspect niet van toepassing?">
                  <nldd-multi-line-text-field
                    rows="2"
                    required
                    .value=${antwoord?.nvtReden ?? ''}
                    @input=${(e: Event) => zet((x) => (x.nvtReden = waarde(e)))}
                  ></nldd-multi-line-text-field>
                  <nldd-validation-list>
                    <nldd-validation-item required>Een reden is nodig: zonder reden telt dit aspect als open.</nldd-validation-item>
                  </nldd-validation-list>
                </nldd-form-field>
              `
            : nothing}
        </nldd-form-section>

        ${relevantie !== 'nvt'
          ? html`
              <nldd-form-section text="Afweging" supporting-text="Behandeld is een aspect als situatie, keuze en motivatie zijn ingevuld.">
                ${tekstveld({ label: 'Situatie', meerregelig: true, waarde: antwoord?.situatie ?? '', bij: (v) => zet((x) => (x.situatie = v)), help: 'Wat geldt er nu voor deze dienst?' })}
                ${tekstveld({ label: 'Overwogen opties', meerregelig: true, optioneel: true, waarde: antwoord?.overweging ?? '', bij: (v) => zet((x) => (x.overweging = v)), help: 'Welke opties en alternatieven heb je bekeken?' })}
                ${tekstveld({ label: 'Keuze', meerregelig: true, regels: 2, waarde: antwoord?.keuze ?? '', bij: (v) => zet((x) => (x.keuze = v)), help: 'Wat heb je gekozen?' })}
                ${tekstveld({ label: 'Motivatie', meerregelig: true, waarde: antwoord?.motivatie ?? '', bij: (v) => zet((x) => (x.motivatie = v)), help: 'Waarom deze keuze?' })}
              </nldd-form-section>

              ${lijstEditor({
                titel: "Risico's en open punten",
                toelichting: 'Wat blijft er open, en wie is daar eigenaar van?',
                itemNaam: 'Risico',
                items: antwoord?.risicos ?? [],
                velden: [
                  { sleutel: 'omschrijving', label: 'Omschrijving', soort: 'meerregelig' },
                  { sleutel: 'eigenaar', label: 'Eigenaar', soort: 'tekst', optioneel: true },
                  { sleutel: 'gevoelig', label: 'Gevoelige informatie: niet opnemen in de openbare versie', soort: 'vinkje' },
                ],
                nieuw: () => ({ omschrijving: '', gevoelig: false }),
                bij: (items) => zet((x) => (x.risicos = items)),
              })}

              ${lijstEditor({
                titel: 'Onderbouwing',
                toelichting: 'Documenten, besluiten en standaarden die je keuze onderbouwen.',
                itemNaam: 'Bron',
                items: antwoord?.onderbouwing ?? [],
                velden: [
                  { sleutel: 'titel', label: 'Titel', soort: 'tekst' },
                  { sleutel: 'url', label: 'Link', soort: 'url', optioneel: true },
                  {
                    sleutel: 'soort',
                    label: 'Soort',
                    soort: 'keuze',
                    opties: { document: 'Document', besluit: 'Besluit', standaard: 'Standaard', assessment: 'Eerder assessment', overig: 'Overig' },
                  },
                ],
                nieuw: () => ({ titel: '', soort: 'document' as const }),
                bij: (items) => zet((x) => (x.onderbouwing = items)),
              })}
            `
          : nothing}

        <nldd-form-actions>
          <nldd-button-group>
            ${volgende
              ? html`<nldd-button appearance="primary" end-icon="arrow-right" text="Volgend aspect: ${volgende.titel}" href=${link.aspect(volgende.id)}></nldd-button>`
              : html`<nldd-button appearance="primary" end-icon="arrow-right" text="Naar voortgang en dekking" href=${link.overzicht}></nldd-button>`}
          </nldd-button-group>
        </nldd-form-actions>
      </nldd-form>
      </nldd-container>
    </nldd-simple-section>

    <nldd-simple-section>
      <nldd-title slot="header" heading-level="2" text="Kaders bij dit aspect" supporting-text="Met dit aspect behandel je deze onderdelen van de kaders."></nldd-title>
      <nldd-list appearance="box-base" accessible-label="Gekoppelde kaderonderdelen">
        ${kaderIds.flatMap((k) =>
          (aspect.koppelingen[k] ?? []).map(({ id, waarom }) => {
            const kader = c.kaders.get(k);
            const o = kader?.onderdelen.find((x) => x.id === id);
            return o && kader
              ? html`<nldd-list-item href=${o.bron} target="_blank">
                  <nldd-text-cell overline=${kader.afkorting} text=${o.titel} supporting-text=${waarom ?? ''}></nldd-text-cell>
                </nldd-list-item>`
              : nothing;
          }),
        )}
      </nldd-list>
    </nldd-simple-section>

    ${hulpmiddelen.length
      ? html`<nldd-simple-section>
          <nldd-title
            slot="header"
            heading-level="2"
            text="Hulpmiddelen"
            supporting-text=${fase ? 'Uit NeRDS, passend bij de fase van je project.' : 'Uit NeRDS. Kies een fase bij "Over de dienst" om de lijst te verkleinen.'}
          ></nldd-title>
          <nldd-list appearance="box-base" accessible-label="Hulpmiddelen">
            ${hulpmiddelen.map(
              (h) => html`<nldd-list-item href=${h.bron!} target="_blank">
                <nldd-text-cell overline=${h.status === 'beschikbaar' ? '' : h.status} text=${h.naam} supporting-text=${h.beschrijving}></nldd-text-cell>
              </nldd-list-item>`,
            )}
          </nldd-list>
        </nldd-simple-section>`
      : nothing}
  `;
}
