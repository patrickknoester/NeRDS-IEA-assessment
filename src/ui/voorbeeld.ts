import { html, nothing } from 'lit';
import type { Assessment } from '../model/assessment.ts';
import { geldigeUrl } from '../model/rapport.ts';

/** Vaste melding bij een voorbeeldcasus, met de bronnen. */
export function voorbeeldMelding(a: Assessment) {
  if (!a.voorbeeld) return nothing;
  return html`
    <nldd-banner variant="accent" text="Dit is een voorbeeld" supporting-text=${a.voorbeeld.toelichting}>
      <nldd-rich-text>
        <ul>
          ${a.voorbeeld.bronnen.map((b) => {
            const u = geldigeUrl(b.url);
            return html`<li>${u ? html`<a href=${u} target="_blank" rel="noopener">${b.titel}</a>` : b.titel}</li>`;
          })}
        </ul>
      </nldd-rich-text>
    </nldd-banner>
  `;
}
