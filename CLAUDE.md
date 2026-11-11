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
- `npm run import`: haal NeRDS (nieuwste release) en NORA/GDI opnieuw op. Controleer
  daarna de diff en draai `npm test`: die faalt op kapotte verwijzingen.
- `npm run crosswalk`: maak `docs/crosswalk-review.md` opnieuw na een wijziging in `data/`
- `npm run lint`: `nldd lint` over index.html en alle Lit-templates. Let op: `nldd lint src`
  vindt de .ts-bestanden niet; geef ze expliciet mee (zoals het npm-script doet).
- `npx nldd lint`: controleer het gebruik van het designsysteem. Let op: dit vangt niet
  alle ongeldige attribuutwaarden in Lit-templates (bijv. `layout="horizontal"`). Zoek
  toegestane waarden op met `/nldd-design` of in `custom-elements.json` van het pakket.

## Structuur

- `src/app.ts`: root-component (light DOM). Startscherm: `nldd-shell` > `nldd-page`. Met een
  assessment open: `nldd-navigation-split-view` met zijbalk en hoofdpagina (patroon
  "applicatie"); de hoofdpagina wordt per route opnieuw gemaakt (`keyed`) zodat elk scherm
  bovenaan begint.
- `src/router.ts`: hash-routes (`#/context`, `#/thema/<id>`, `#/aspect/<id>`, `#/iea`, `#/overzicht`, `#/rapport`)
- `src/model/rapport.ts`: het rapport als data (ook de openbare versie zonder gevoelige
  onderdelen); `src/ui/rapport.ts` toont het. Het rapport staat buiten de zijbalk. Bij afdrukken
  (`beforeprint`) laat de app de bediening weg en zet `data-scheme="light"`: geen print-CSS.
- `src/model/iea-export.ts`: machine-leesbare IEA-bijlage (voorlopig formaat, Engelse velden)
- `src/state/store.ts`: het assessment, autosave in localStorage, JSON in/uit
- `src/ui/`: één renderfunctie per scherm; `velden.ts` en `lijst-editor.ts` voor formuliervelden
- `src/model/`: Zod-schema's (kader, aspect/thema, hulpmiddel, assessment, beslisboom)
- `src/data/catalogus.ts`: leest alle YAML, valideert en controleert verwijzingen;
  `src/data/laad.ts` bundelt `data/**/*.yaml` via Vite
- `data/kaders/*.yaml`: één bestand per kader. `nerds`, `nora` en `gdi` zijn
  **gegenereerd** (`npm run import`), niet met de hand bewerken. `iea` en `eif` zijn handwerk.
- `data/themas.yaml`, `data/aspecten/<thema>.yaml`: de crosswalk. Elke koppeling krijgt
  een `waarom`; status is "voorstel, nog niet gereviewd"
- `data/hulpmiddelen/`: hulpmiddelen per kaderonderdeel en fase (NeRDS action registry)
- `data/iea/beslisboom.yaml`: wanneer het IEA-assessment verplicht is
- `data/voorbeelden/*.yaml`: ingevulde voorbeeldcasussen. Elk voorbeeld heeft
  `assessment.voorbeeld` met toelichting en bronnen; de app en het rapport tonen dat als vaste
  melding. Echte organisaties nooit als invuller opvoeren: feiten uit openbare bronnen, de
  uitvoering en keuzes fictief, de organisatie "Voorbeeldorganisatie (fictief)".
- `docs/bronnen/`: wat we over elke bron weten en hoe we hem importeren
- `scripts/`: importscripts (draaien direct met `node`, TypeScript zonder build)

## Werkafspraken

- **GitHub-account controleren vóór elke push, issue of PR.** Dit project hoort bij het
  account `patrickknoester`; op deze machine staat standaard `qurkwijn` actief (voor andere
  projecten). Controleer met `gh api user -q .login`. Staat er `qurkwijn`, wissel dan met
  `gh auth switch --user patrickknoester`, voer de actie uit, en zet daarna terug met
  `gh auth switch --user qurkwijn`. De git-identiteit van deze repo staat lokaal ingesteld.

- **Het opslagschema (`src/model/assessment.ts`) moet half ingevuld werk accepteren.** Geen
  `min(1)` of `refine` op invoervelden: een ongeldig bewaard assessment wordt niet meer
  ingeladen. Volledigheid hoort in `src/model/voortgang.ts`.
- Geen eigen CSS of classes op `nldd-*`; gebruik attributen, slots en `nldd-container`.
- UI-teksten en inhoud in het Nederlands, in heldere taal (B1).
- Beweer niets over de inhoud van een kader zonder bron. Wat niet uit de bron is
  nagelezen, markeer je als onzeker (dit geldt nu nog voor het IEA-deel van het brief).

## Beslissingen

- **2026-11-11 – Vite in plaats van Astro.** De app is één interactief formulier met
  client-side state (autosave, JSON in/uit, rapportweergave). Daar voegt Astro weinig toe,
  en Lit-componenten serverside renderen in Astro is omslachtig. Vite + Lit sluit direct
  aan op het designsysteem. Heroverwegen als er veel statische inhoudspagina's bij komen
  (bijv. een kaderbrowser).
- **2026-11-11 – Licentie EUPL-1.2**, zoals NeRDS. Hosting op GitHub Pages via
  `.github/workflows/pages.yml` zodra de repo openbaar is.
- **2026-11-11 – Hosting later.** Lokaal draaien met `npm run dev`; Docker is niet nodig
  voor een statische app. Omdat alles local-first is, werkt GitHub Pages. Pas als er
  opslag op een server nodig is (samenwerken), kijken naar bijv. ZAD.
