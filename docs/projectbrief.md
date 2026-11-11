# Projectbrief: Interoperabiliteits- en architectuurassessment (POC)

> Samenvatting van een verkennend gesprek (11 november 2026). Bedoeld als startpunt voor
> verdere uitwerking thuis met Claude Code. Je kunt dit bestand als `CLAUDE.md` in de
> nieuwe repo zetten of ernaar verwijzen.

## Doel

Een webapp waarmee overheidsorganisaties een **assessment** doorlopen voor een digitale
dienst of een project. De uitkomst is een **verantwoordingsrapport**. Dat rapport laat zien
dat over alle belangrijke aspecten is nagedacht en dat de keuzes goed onderbouwd zijn.

- Verplicht gebruik: **Interoperable Europe Act (IEA)**, Verordening (EU) 2024/903,
  art. 3. Dit is het interoperabiliteitsassessment voor trans-Europese digitale publieke
  diensten.
- Breder gebruik: ook voor nationale en lokale diensten en projecten, getoetst aan de
  Nederlandse kaders.
- Context: **POC voor de NLDD** (https://digitaledienst.overheid.nl).

## Uitgangspunten (besloten)

1. **Eén variant** voor de hele digitale overheid. Internationale diensten moeten ook aan
   de Nederlandse eisen voldoen, dus het IEA-deel is een *aanvulling* bovenop de NL-kaders
   en geen aparte tool.
2. **Kaders** die erin moeten:
   - IEA en de assessmentrichtlijnen
     (https://interoperable-europe.ec.europa.eu/collection/assessments/assessment-guidelines)
   - EIF (European Interoperability Framework): juridische, organisatorische, semantische
     en technische laag, plus governance
   - NeRDS (https://nerds.digitaledienst.overheid.nl/)
   - Architectuur Digitale Overheid (ADO)
   - GDI-domeinarchitecturen
   - NORA
3. **Uitkomst = verantwoordingsrapport**, geen checklist en geen oordeel "voldoet / voldoet
   niet". Het criterium is: *volledig en onderbouwd*.
4. **Huisstijl:** het NLDD Designsysteem, volledig, met het rijkslint en Rijksoverheid Sans.
   Dat mag omdat het een NLDD-POC is.
   - Repo: https://github.com/NederlandseDigitaleDienst/design-system/
   - `npm install @nldd/design-system`. Dit zijn web components op Lit (`<nldd-button>`
     enz.) met CSS-tokens.
   - `import '@nldd/design-system/styles'` voor de tokens en fonts.
   - Er is een **Claude Code-plugin** met skills om met het designsysteem te bouwen en
     te valideren. Installeer die.
   - De componentdocumentatie staat in Storybook en in `skills/nldd-design/reference.md`.

## Kernconcept: één vraag, meerdere kaders (crosswalk)

De kaders overlappen sterk. NORA is bijvoorbeeld op het EIF gebaseerd. Daarom is er één
set **aspecten**, en elk aspect is gekoppeld aan alle kaderonderdelen die erbij horen.
Niemand vult dus iets dubbel in.

```yaml
id: hergebruik-bouwstenen
thema: hergebruik
titel: "Hergebruik van bestaande voorzieningen"
toelichting: "..."
geldt_als: altijd            # of: grensoverschrijdend
koppelingen:
  iea:   [art-3, ...]
  eif:   [technisch, organisatorisch]
  nerds: [...]
  ado:   [...]
  gdi:   [toegang, gegevensuitwisseling]
  nora:  [...]
```

- **Kaders als losse, versioneerbare bronbestanden** met vaste ID's en bronlinks, bijvoorbeeld
  `data/kaders/nerds.yaml`, `data/kaders/nora.yaml`, enzovoort.
- **Aspecten en crosswalk als data, niet als code.** Wijzigingen in een kader betekenen
  dan alleen een data-update.
- **Contextvragen vooraf** bepalen wat iemand te zien krijgt: is de dienst
  grensoverschrijdend, gaat het om een bindende eis, wat voor organisatie is het?
- **Elke assessment legt vast welke versie van de kaders gebruikt is**, zodat oude
  rapporten geldig blijven.

## Invulstructuur per aspect

| Veld | Doel |
|---|---|
| Relevantie | Van toepassing, of n.v.t. **met verplichte reden** |
| Situatie | Wat geldt er nu voor deze dienst? |
| Overweging | Welke opties en alternatieven zijn bekeken? |
| Keuze en motivatie | Wat is er gekozen en waarom? |
| Risico's en restpunten | Wat blijft open, en wie is eigenaar? |
| Onderbouwing | Links naar documenten, besluiten en standaarden |

## Rapportstructuur

1. **Managementsamenvatting:** de belangrijkste keuzes, de open risico's en de dekking per kader
2. **Context van de dienst:** doel, doelgroep, grensoverschrijdend of niet, betrokken partijen
3. **Afwegingen per thema:** bijvoorbeeld gebruikers, hergebruik, gegevens, standaarden,
   toegang, veiligheid en privacy, juridisch en governance
4. **Dekkingsmatrix:** kaderonderdelen tegenover de thema's, met de status behandeld,
   n.v.t. (met reden) of open
5. **Bijlage IEA:** in de EU-rapportstructuur, alleen bij grensoverschrijdende diensten
6. **Verantwoording:** gebruikte kaderversies, datum en betrokkenen

## Scope van de POC

- Local-first: geen backend en geen accounts. Opslaan en inladen gaat als JSON-bestand,
  met een autosave in de browser.
- Een **gedeeltelijke crosswalk**: een paar thema's goed uitgewerkt is genoeg om het
  concept te laten zien.
- Rapportexport als printbare HTML of PDF in de NLDD-stijl.
- Eén **voorbeeldcasus die al is ingevuld**, voor demo's.
- Statisch te hosten, bijvoorbeeld op GitHub Pages.

## Voorgestelde stack

- Vite + TypeScript
- NLDD web components. Lit ligt het meest voor de hand omdat het designsysteem er zelf
  op gebouwd is.
- Data in YAML of JSON in `data/`, met een schema voor validatie, bijvoorbeeld JSON Schema
  of Zod.
- Vitest voor tests

## Volgende stappen

1. [ ] Repo aanmaken en de NLDD-designsysteemplugin voor Claude Code installeren.
2. [ ] **Kaders inventariseren:** controleer bij elk kader of er al een machine-leesbare
       bron is, bijvoorbeeld een GitHub-repo of een wiki-export, en zet ze om naar een
       gezamenlijk formaat.
3. [ ] **De IEA-richtlijnen precies nalezen**, met name de officiële vragenlijst en
       rapportstructuur. In de cloudsessie was de EU-site niet bereikbaar, dus wat er nu
       over IEA in deze brief staat, komt niet rechtstreeks uit de bron.
4. [ ] De themaindeling en de eerste crosswalk opzetten. **Dit is het eigenlijke
       inhoudelijke werk:** laat het reviewen door architecten, bijvoorbeeld uit de
       NORA-community.
5. [ ] Een prototype van de invulflow en de rapportweergave bouwen.
6. [ ] Testen met twee casussen: één grensoverschrijdende en één lokale dienst.

## Open punten

- Eigenaarschap van de crosswalk op de lange termijn: wie beheert hem officieel?
- Samenwerken met meerdere invullers en reviewers. Voor nu buiten scope, maar het
  datamodel moet het later mogelijk maken.
- Hoe het rapport aansluit op de publicatie via het Interoperable Europe-portaal
  (formaat en metadata).
