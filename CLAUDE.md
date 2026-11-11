# IEA- en architectuurassessment (POC voor de NLDD)

Webapp waarmee overheidsorganisaties voor een digitale dienst of project een assessment
doorlopen. De uitkomst is een **verantwoordingsrapport**: volledig en onderbouwd, geen
checklist en geen oordeel "voldoet / voldoet niet".

Het volledige projectbrief staat in [docs/projectbrief.md](docs/projectbrief.md). Lees dat
eerst bij inhoudelijk werk.

## Kern in het kort

- Eén tool voor de hele digitale overheid. Het IEA-deel (Verordening (EU) 2024/903, art. 3)
  is een **aanvulling** op de Nederlandse kaders, geen aparte variant.
- Kaders: IEA + assessmentrichtlijnen, EIF, NeRDS, ADO, GDI-domeinarchitecturen, NORA.
- **Crosswalk:** één set aspecten, elk gekoppeld aan alle kaderonderdelen die erbij horen.
  Niemand vult iets dubbel in.
- **Data, geen code:** kaders in `data/kaders/*.yaml` (vaste ID's, bronlinks, versie),
  aspecten en crosswalk ook als data, gevalideerd met een schema.
- Elke assessment legt vast welke kaderversies gebruikt zijn.
- Invulvelden per aspect: relevantie (n.v.t. alleen met reden), situatie, overweging,
  keuze en motivatie, risico's en restpunten (met eigenaar), onderbouwing (links).

## Technische keuzes

- **Vite + TypeScript + Lit**, NLDD web components (`@nldd/design-system`).
  Astro is overwogen; zie "Beslissingen".
- `import '@nldd/design-system/styles'` (Rijksoverheid Sans; toegestaan omdat dit een
  NLDD-POC is). Volledig NLDD-designsysteem, inclusief rijkslint.
- Gebruik de skills van de plugin `nldd-design-system` (`/nldd-design`,
  `/nldd-design-build`, `/nldd-design-validate`). Controleer UI met `nldd lint`.
  De plugin staat project-breed aan via `.claude/settings.json`.
- Local-first: geen backend, geen accounts. Opslaan/inladen als JSON-bestand, autosave
  in de browser. Statisch te hosten.
- Vitest voor tests. Schema-validatie met Zod of JSON Schema.
- Datamodel moet later meerdere invullers en reviewers mogelijk maken (nu buiten scope).

## Commando's

- `npm run dev`: ontwikkelserver op http://localhost:5173
- `npm test`: Vitest
- `npm run build`: typecheck en productiebuild in `dist/`
- `npx nldd lint`: controleer het gebruik van het designsysteem. Let op: dit vangt niet
  alle ongeldige attribuutwaarden in Lit-templates (bijv. `layout="horizontal"`). Zoek
  toegestane waarden op met `/nldd-design` of in `custom-elements.json` van het pakket.

## Structuur

- `src/app.ts`: root-component (light DOM; `nldd-shell` > `nldd-page`)
- `src/model/`: Zod-schema's voor aspecten, kaders en assessments
- `data/kaders/`, `data/aspecten/`: kader- en crosswalkdata (YAML)

## Werkafspraken

- UI-teksten en inhoud in het Nederlands, in heldere taal (B1).
- Beweer niets over de inhoud van een kader zonder bron. Wat niet uit de bron is
  nagelezen, markeer je als onzeker (dit geldt nu nog voor het IEA-deel van het brief).

## Beslissingen

- **2026-11-11 – Vite in plaats van Astro.** De app is één interactief formulier met
  client-side state (autosave, JSON in/uit, rapportweergave). Daar voegt Astro weinig toe,
  en Lit-componenten serverside renderen in Astro is omslachtig. Vite + Lit sluit direct
  aan op het designsysteem. Heroverwegen als er veel statische inhoudspagina's bij komen
  (bijv. een kaderbrowser).
- **2026-11-11 – Hosting later.** Lokaal draaien met `npm run dev`; Docker is niet nodig
  voor een statische app. Omdat alles local-first is, werkt GitHub Pages. Pas als er
  opslag op een server nodig is (samenwerken), kijken naar bijv. ZAD.
