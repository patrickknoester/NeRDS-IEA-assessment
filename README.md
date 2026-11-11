# Interoperabiliteits- en architectuurassessment (proof of concept)

Een webapp waarmee overheidsorganisaties voor een digitale dienst of een project een
assessment doorlopen. De uitkomst is een **verantwoordingsrapport**: het laat zien dat over
alle belangrijke aspecten is nagedacht en dat de keuzes onderbouwd zijn. Het is geen checklist
en geeft geen oordeel "voldoet / voldoet niet".

**Probeer het:** https://patrickknoester.github.io/NeRDS-IEA-assessment/

> **Proof of concept.** Dit is geen officiële dienst. De crosswalk tussen de kaders is een
> eerste voorstel en nog niet getoetst door de beheerders van die kaders.

## Het idee: één vraag, meerdere kaders

De kaders voor de digitale overheid overlappen sterk. Daarom is er één set **aspecten**, en elk
aspect is gekoppeld aan alle kaderonderdelen waar het bij hoort. Wie een aspect invult,
behandelt die onderdelen in één keer:

| Kader | Wat erin zit | Bron |
|---|---|---|
| [NeRDS](https://nerds.digitaledienst.overheid.nl/) | 13 richtlijnen en de hulpmiddelen per projectfase | GitHub-release, automatisch geïmporteerd |
| [NORA](https://www.noraonline.nl) | Architectuurprincipes (NAP) en kwaliteitsdoelen | NORA Online-API, automatisch geïmporteerd |
| GDI-domeinarchitecturen | Principes van Gegevensuitwisseling; domein Identificatie en authenticatie | NORA Online-API |
| EIF | Interoperabiliteitslagen en de 12 principes | Met de hand overgenomen |
| [Interoperable Europe Act](https://eur-lex.europa.eu/eli/reg/2024/903/oj) | Artikel 3, de beslisboom en de inhoud van de bijlage | Met de hand overgenomen uit de [richtlijnen](https://interoperable-europe.ec.europa.eu/collection/assessments/assessment-guidelines) |

Het IEA-deel is een **aanvulling** voor grensoverschrijdende diensten, geen aparte tool.
Een beslisboom zegt of het IEA-assessment verplicht is.

Kaders en crosswalk zijn **data, geen code** (`data/`). Elk assessment legt vast welke versie
van elk kader gebruikt is. De crosswalk met reden per koppeling en de dekkingsmatrix staan in
[docs/crosswalk-review.md](docs/crosswalk-review.md).

## Wat werkt er al

- Contextvragen over de dienst, met de IEA-beslisboom voor grensoverschrijdende diensten
- Per thema de aspecten, elk met relevantie (n.v.t. alleen met reden), situatie, overwogen
  opties, keuze, motivatie, risico's met eigenaar, onderbouwing, de gekoppelde kaderonderdelen
  en passende hulpmiddelen uit NeRDS
- De IEA-bijlage volgens de minimale inhoud uit de verordening
- Voortgang per thema en dekking per kader
- Het verantwoordingsrapport: managementsamenvatting, context, afwegingen per thema,
  dekkingsmatrix, IEA-bijlage en verantwoording. Af te drukken of op te slaan als PDF, met een
  openbare versie zonder gevoelige onderdelen
- De IEA-bijlage als machine-leesbare JSON (voorlopig formaat, tot het datamodel van de
  Europese Commissie er is)
- Alles blijft in je browser (automatisch bewaard); opslaan en openen als JSON-bestand

- Een ingevulde voorbeeldcasus (de Europese gehandicapten- en parkeerkaart), te openen vanaf de
  startpagina. De EU-feiten zijn echt, de Nederlandse uitvoering en de keuzes zijn verzonnen.

Nog niet: een tweede, nationale voorbeeldcasus, en de thema's buiten de eerste drie. Zie [docs/plan.md](docs/plan.md).

## Privacy

Er is geen server en er zijn geen accounts. Wat je invult, blijft in de `localStorage` van je
eigen browser tot je het als bestand opslaat. De site laadt geen externe scripts en doet geen
metingen.

## Zelf draaien

Vereist Node.js 24 of hoger.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest, inclusief controle van alle verwijzingen in data/
npm run lint       # gebruik van het NLDD-designsysteem
npm run build      # statische site in dist/
```

Kaders bijwerken naar de nieuwste bronversie:

```bash
npm run import     # NeRDS, NORA en GDI opnieuw ophalen
npm test           # faalt als een koppeling naar een verdwenen onderdeel wijst
npm run crosswalk  # reviewstuk en dekkingsmatrix opnieuw maken
```

## Opbouw

- `data/kaders/`: één bestand per kader. `nerds`, `nora` en `gdi` worden gegenereerd door
  `scripts/`; `iea` en `eif` zijn handwerk.
- `data/themas.yaml`, `data/aspecten/`: de crosswalk
- `data/iea/beslisboom.yaml`: wanneer het IEA-assessment verplicht is
- `src/model/`: schema's (Zod) en de logica voor voortgang en dekking
- `src/ui/`: de schermen, gebouwd met [Lit](https://lit.dev) en het
  [NLDD Designsysteem](https://github.com/NederlandseDigitaleDienst/design-system)
- `docs/bronnen/`: wat we per bron weten en hoe we hem importeren

## Meedenken

De crosswalk is het eigenlijke werk. Klopt een koppeling niet, mist er een aspect, of ken je
een machine-leesbare bron voor de ADO of de GDI-domeinarchitecturen? Maak een issue aan.

## Licenties

- De code valt onder de [EUPL-1.2](LICENSE).
- NeRDS-inhoud in `data/` komt uit [NeRDS](https://github.com/NederlandseDigitaleDienst/NeRDS)
  (EUPL-1.2).
- Van NORA, de GDI-architecturen, het EIF en de IEA nemen we alleen ID's, titels, korte eigen
  samenvattingen en links naar de bron over.
- Het NLDD Designsysteem, met Rijksoverheid Sans, het rijkslint en het logo, is bedoeld voor
  de Rijksoverheid en partijen die in haar opdracht werken. Zie de
  [NOTICES](https://github.com/NederlandseDigitaleDienst/design-system/blob/main/NOTICES.md)
  van het designsysteem. Hergebruik je deze code buiten de Rijksoverheid, gebruik dan
  `@nldd/design-system/styles/open-font` (Inter) en laat het logo weg.
