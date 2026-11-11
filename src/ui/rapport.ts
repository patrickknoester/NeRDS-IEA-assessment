import { html, nothing, type TemplateResult } from 'lit';
import type { Catalogus } from '../data/catalogus.ts';
import { eifLagen, type Assessment } from '../model/assessment.ts';
import { ieaExport } from '../model/iea-export.ts';
import { bouwRapport, geldigeUrl, type Rapport, type RapportAspect } from '../model/rapport.ts';
import { link } from '../router.ts';
import { aangevinkt, bestandsnaam, download } from './basis.ts';
import { effectTekst, faseTekst, laagTekst, organisatieTekst, statusTekst } from './teksten.ts';

const datum = (iso: string) =>
  new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

/** Tekst met behoud van alinea's; leeg wordt een streepje zodat het opvalt. */
function tekst(t: string | undefined): TemplateResult {
  const blokken = (t ?? '').trim().split(/\n{2,}/).filter(Boolean);
  if (!blokken.length) return html`<p><em>Niet ingevuld</em></p>`;
  return html`${blokken.map((b) => html`<p>${b}</p>`)}`;
}

function bronLink(titel: string, url: string | undefined): TemplateResult {
  const u = geldigeUrl(url);
  return u ? html`<a href=${u} target="_blank" rel="noopener">${titel}</a>` : html`${titel}`;
}

function aspectBlok(x: RapportAspect): TemplateResult {
  const a = x.antwoord;
  return html`
    <h3>${x.aspect.titel}</h3>
    <p><strong>Status:</strong> ${statusTekst[x.status]}${x.aspect.geldt_als === 'grensoverschrijdend' ? ' · alleen bij grensoverschrijdende diensten' : ''}</p>
    ${x.status === 'nvt'
      ? html`<p><strong>Niet van toepassing, omdat:</strong> ${a?.nvtReden}</p>`
      : html`
          <h4>Situatie</h4>
          ${tekst(a?.situatie)}
          ${a?.overweging.trim() ? html`<h4>Overwogen opties</h4>${tekst(a.overweging)}` : nothing}
          <h4>Keuze</h4>
          ${tekst(a?.keuze)}
          <h4>Motivatie</h4>
          ${tekst(a?.motivatie)}
          ${x.risicos.length
            ? html`<h4>Risico's en open punten</h4>
                <ul>
                  ${x.risicos.map((r) => html`<li>${r.omschrijving}${r.eigenaar ? html` <em>(eigenaar: ${r.eigenaar})</em>` : nothing}</li>`)}
                </ul>`
            : nothing}
          ${a?.onderbouwing.filter((o) => o.titel.trim()).length
            ? html`<h4>Onderbouwing</h4>
                <ul>
                  ${a.onderbouwing.filter((o) => o.titel.trim()).map((o) => html`<li>${bronLink(o.titel, o.url)}</li>`)}
                </ul>`
            : nothing}
        `}
    <p><small><strong>Kaders:</strong> ${x.koppelingen.map((k, i) => html`${i ? ' · ' : ''}${k.kader}: ${bronLink(k.titel, k.bron)}`)}</small></p>
  `;
}

function sectie(titel: string, inhoud: TemplateResult, id?: string): TemplateResult {
  return html`
    <nldd-simple-section>
      <nldd-title id=${id ?? nothing} slot="header" heading-level="2" text=${titel}></nldd-title>
      <nldd-rich-text>${inhoud}</nldd-rich-text>
    </nldd-simple-section>
  `;
}

function iea(r: NonNullable<Rapport['iea']>): TemplateResult {
  const d = r.data;
  const lijst = <T,>(items: T[], f: (x: T) => TemplateResult | string) =>
    items.length ? html`<ul>${items.map((x) => html`<li>${f(x)}</li>`)}</ul>` : html`<p><em>Geen</em></p>`;
  const verplicht =
    r.verplichting?.status === 'verplicht'
      ? 'Ja, volgens de beslisboom uit de IEA-richtlijnen.'
      : r.verplichting?.status === 'niet-verplicht'
        ? `Nee: ${r.verplichting.reden} Dit is een vrijwillig assessment.`
        : 'Nog niet vastgesteld.';
  return html`
    <p>Opgesteld volgens de minimale inhoud uit de bijlage bij Verordening (EU) 2024/903 (Interoperable Europe Act).</p>
    <p><strong>Verplicht assessment:</strong> ${verplicht}</p>
    <h3>1. Algemene informatie</h3>
    ${tekst(d.initiatief)}
    <h3>2. Eisen</h3>
    <h4>Betrokken trans-Europese digitale publieke diensten</h4>
    ${lijst(d.diensten, (x) => html`${x.naam}${x.beschrijving ? html`: ${x.beschrijving}` : nothing}`)}
    <h4>Beoordeelde bindende eisen</h4>
    ${lijst(d.bindendeEisen, (x) => html`${x.omschrijving}${x.bron ? html` <em>(${x.bron})</em>` : nothing}`)}
    <h4>Geraakte belanghebbenden</h4>
    ${lijst(d.belanghebbenden, (x) => `${x.categorie} (${x.sector})`)}
    <h4>Effecten op grensoverschrijdende interoperabiliteit</h4>
    <table>
      <thead><tr><th>Laag</th><th>Effect</th><th>Toelichting</th></tr></thead>
      <tbody>
        ${eifLagen.map((l) => {
          const e = d.effecten[l];
          return html`<tr><td>${laagTekst[l]}</td><td>${e?.oordeel ? effectTekst[e.oordeel] : 'Niet beoordeeld'}</td><td>${e?.toelichting ?? ''}</td></tr>`;
        })}
      </tbody>
    </table>
    <h3>3. Resultaten</h3>
    <h4>Interoperable Europe-oplossingen</h4>
    ${lijst(d.ieOplossingen, (x) => html`${bronLink(x.naam, x.url)}${x.toelichting ? html`: ${x.toelichting}` : nothing}`)}
    <h4>Andere interoperabiliteitsoplossingen</h4>
    ${lijst(d.andereOplossingen, (x) => html`${bronLink(x.naam, x.url)}${x.toelichting ? html`: ${x.toelichting}` : nothing}`)}
    <h4>Resterende belemmeringen</h4>
    ${lijst(d.belemmeringen, (x) => html`${x.omschrijving}${x.nodig ? html` <em>Nodig: ${x.nodig}</em>` : nothing}`)}
    ${d.eerdereAssessments.length ? html`<h4>Eerdere assessments</h4>${lijst(d.eerdereAssessments, (x) => bronLink(x.titel, x.url))}` : nothing}
  `;
}

export function rapportScherm(
  a: Assessment,
  c: Catalogus,
  o: { openbaar: boolean; afdrukken: boolean; zetOpenbaar: (v: boolean) => void; opslaan: () => void; drukAf: () => void },
) {
  const r = bouwRapport(c, a, { openbaar: o.openbaar });
  const ctx = r.context;
  const export_ = ieaExport(c, a);

  return html`
    <nldd-shell background="base">
      <nldd-page>
        ${o.afdrukken
          ? nothing
          : html`
              <nldd-simple-section background="tinted">
                <nldd-button-group>
                  <nldd-button appearance="neutral-transparent" start-icon="arrow-left" text="Terug naar het assessment" href=${link.overzicht}></nldd-button>
                </nldd-button-group>
                <nldd-switch-field
                  label="Openbare versie: laat gevoelige onderdelen weg"
                  .checked=${o.openbaar}
                  @change=${(e: Event) => o.zetOpenbaar(aangevinkt(e))}
                ></nldd-switch-field>
                <nldd-button-group>
                  <nldd-button appearance="primary" start-icon="print" text="Afdrukken of opslaan als PDF" @click=${o.drukAf}></nldd-button>
                  ${export_
                    ? html`<nldd-button
                        appearance="secondary"
                        start-icon="download"
                        text="IEA-bijlage als JSON"
                        @click=${() => download(bestandsnaam(`${ctx.dienst} iea-bijlage`), JSON.stringify(ieaExport(c, a), null, 2))}
                      ></nldd-button>`
                    : nothing}
                  <nldd-button appearance="secondary" start-icon="download" text="Assessment opslaan als bestand" @click=${o.opslaan}></nldd-button>
                </nldd-button-group>
                ${export_
                  ? html`<nldd-text size="sm" color="secondary">
                      De JSON volgt de opbouw van de bijlage bij de IEA, zonder gevoelige onderdelen. Het is een voorlopig formaat:
                      het datamodel van de Europese Commissie is nog niet gepubliceerd.
                    </nldd-text>`
                  : nothing}
              </nldd-simple-section>
            `}

        <nldd-simple-section>
          <nldd-title
            slot="header"
            heading-level="1"
            overline="Verantwoordingsrapport${r.openbaar ? ' · openbare versie' : ''}"
            text=${r.titel}
            supporting-text="${ctx.organisatie.naam || 'Organisatie niet ingevuld'} · ${datum(r.opgesteld)}"
          ></nldd-title>
          ${r.openbaar && r.weggelaten
            ? html`<nldd-banner variant="neutral" text="${r.weggelaten} gevoelige ${r.weggelaten === 1 ? 'onderdeel is' : 'onderdelen zijn'} weggelaten"></nldd-banner>`
            : nothing}
          ${r.samenvatting.openAspecten.length
            ? html`<nldd-banner
                variant="warning"
                text="Dit rapport is nog niet volledig"
                supporting-text="${r.samenvatting.openAspecten.length} ${r.samenvatting.openAspecten.length === 1 ? 'aspect is' : 'aspecten zijn'} nog niet behandeld."
              ></nldd-banner>`
            : nothing}
        </nldd-simple-section>

        ${sectie(
          '1. Managementsamenvatting',
          html`
            <h3>Belangrijkste keuzes</h3>
            ${r.samenvatting.keuzes.length
              ? html`<ul>${r.samenvatting.keuzes.map((k) => html`<li><strong>${k.aspect}:</strong> ${k.keuze}</li>`)}</ul>`
              : html`<p><em>Nog geen aspecten behandeld.</em></p>`}
            <h3>Open risico's en punten</h3>
            ${r.samenvatting.risicos.length
              ? html`<ul>${r.samenvatting.risicos.map((x) => html`<li>${x.omschrijving} <em>(${x.aspect}${x.eigenaar ? `, eigenaar: ${x.eigenaar}` : ''})</em></li>`)}</ul>`
              : html`<p><em>Geen risico's vastgelegd.</em></p>`}
            ${r.samenvatting.openAspecten.length
              ? html`<h3>Nog niet behandeld</h3><ul>${r.samenvatting.openAspecten.map((x) => html`<li>${x}</li>`)}</ul>`
              : nothing}
            <h3>Dekking per kader</h3>
            <table>
              <thead><tr><th>Kader</th><th>Behandeld</th><th>Niet van toepassing</th><th>Open</th></tr></thead>
              <tbody>
                ${r.dekking.map((d) => html`<tr><td>${d.afkorting} ${d.versie}</td><td>${d.behandeld}</td><td>${d.nvt}</td><td>${d.open}</td></tr>`)}
              </tbody>
            </table>
            <p><small>Telt de onderdelen van elk kader die aan een aspect in dit assessment gekoppeld zijn.</small></p>
          `,
        )}

        ${sectie(
          '2. Context van de dienst',
          html`
            <dl>
              <dt>Dienst of project</dt><dd>${ctx.dienst || '—'}</dd>
              <dt>Doel</dt><dd>${ctx.doel || '—'}</dd>
              <dt>Doelgroep</dt><dd>${ctx.doelgroep || '—'}</dd>
              <dt>Organisatie</dt><dd>${ctx.organisatie.naam || '—'}${ctx.organisatie.soort ? ` (${organisatieTekst[ctx.organisatie.soort]})` : ''}</dd>
              <dt>Fase</dt><dd>${ctx.fase ? faseTekst[ctx.fase] : '—'}</dd>
              <dt>Grensoverschrijdend</dt><dd>${ctx.grensoverschrijdend === 'ja' ? 'Ja' : ctx.grensoverschrijdend === 'nee' ? 'Nee' : '—'}</dd>
            </dl>
          `,
        )}

        ${sectie(
          '3. Afwegingen per thema',
          html`${r.themas.map(
            (t) => html`
              <h3>${t.thema.titel}</h3>
              ${t.aspecten.map((x) => aspectBlok(x))}
            `,
          )}`,
        )}

        ${sectie(
          '4. Dekkingsmatrix',
          html`
            <p>Per kaderonderdeel: behandeld als minstens één gekoppeld aspect behandeld is, niet van toepassing als alle gekoppelde aspecten dat zijn, en anders open.</p>
            ${r.dekking.map(
              (d) => html`
                <h3>${d.naam} (${d.afkorting} ${d.versie})</h3>
                <table>
                  <thead><tr><th>Onderdeel</th><th>Status</th><th>Via aspect</th></tr></thead>
                  <tbody>
                    ${d.rijen.map(
                      (rij) => html`<tr>
                        <td>${bronLink(rij.titel, rij.bron)}</td>
                        <td>${statusTekst[rij.status]}</td>
                        <td>${rij.aspecten.map((id) => c.aspecten.find((x) => x.id === id)?.titel ?? id).join(', ')}</td>
                      </tr>`,
                    )}
                  </tbody>
                </table>
              `,
            )}
          `,
        )}

        ${r.iea ? sectie('5. Bijlage: Interoperable Europe Act', iea(r.iea)) : nothing}

        ${sectie(
          `${r.iea ? 6 : 5}. Verantwoording`,
          html`
            <h3>Gebruikte kaderversies</h3>
            <table>
              <thead><tr><th>Kader</th><th>Versie in dit assessment</th><th>Bron</th></tr></thead>
              <tbody>
                ${r.verantwoording.kaderVersies.map(
                  (k) => html`<tr>
                    <td>${k.naam}</td>
                    <td>${k.versie}${k.huidigeVersie && k.huidigeVersie !== k.versie ? html` <em>(nu beschikbaar: ${k.huidigeVersie})</em>` : nothing}</td>
                    <td>${bronLink(k.afkorting, k.bron)}</td>
                  </tr>`,
                )}
              </tbody>
            </table>
            <h3>Betrokkenen</h3>
            ${r.verantwoording.betrokkenen.length
              ? html`<ul>${r.verantwoording.betrokkenen.map((b) => html`<li>${b.naam}, ${b.rol}${b.organisatie ? `, ${b.organisatie}` : ''}</li>`)}</ul>`
              : html`<p><em>Niet ingevuld.</em></p>`}
            <h3>Over dit rapport</h3>
            <p>
              Assessment begonnen op ${datum(r.verantwoording.aangemaakt)}, laatst gewijzigd op ${datum(r.verantwoording.gewijzigd)},
              rapport opgesteld op ${datum(r.opgesteld)}. Kenmerk: <code>${r.verantwoording.assessmentId}</code>.
            </p>
            <p>
              Gemaakt met het proof of concept
              <a href="https://github.com/patrickknoester/NeRDS-IEA-assessment" target="_blank" rel="noopener">interoperabiliteits- en architectuurassessment</a>.
              De koppelingen tussen aspecten en kaders zijn een voorstel en nog niet getoetst door de beheerders van de kaders.
            </p>
          `,
        )}
      </nldd-page>
    </nldd-shell>
  `;
}
