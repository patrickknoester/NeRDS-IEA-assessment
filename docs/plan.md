# Plan POC interoperabiliteits- en architectuurassessment

Stand: 11 november 2026 (fase 1 t/m 5 gebouwd; zie *Open punten* onderaan). Uitgangspunten staan in [projectbrief.md](projectbrief.md).

## Wat we nu weten over de IEA (uit de bron nagelezen)

Bron: [Guidelines Chapter 4](https://interoperable-europe.ec.europa.eu/collection/assessments/guidelines-chapter-4-how-document-assessment-comprehensive-report)
(laatste update 8 januari 2025).

- **Het IEA-assessment gaat over *bindende eisen*** (binding requirements) voor
  trans-Europese digitale publieke diensten, en niet over een dienst als geheel. In ons model
  is een bindende eis daarom een apart object binnen een assessment.
- **Het rapport moet machine-leesbaar zijn**, gepubliceerd op een officiële website,
  elektronisch gedeeld met de Interoperable Europe Board en zonder gevoelige informatie.
  Een geschoonde versie met een reden is toegestaan.
- **De minimale inhoud volgt de bijlage bij de IEA:**
  1. *Algemene informatie:* indienende organisatie en het betreffende initiatief of project
  2. *Eisen:* de betrokken trans-Europese diensten, de beoordeelde bindende eisen, de
     geraakte publieke en private belanghebbenden, en het effect per EIF-laag (juridisch,
     organisatorisch, semantisch, technisch) als **Beneficial / Negligible / Risky** met
     toelichting
  3. *Resultaten:* de gebruikte Interoperable Europe-oplossingen, andere
     interoperabiliteitsoplossingen en de resterende belemmeringen
- **De Commissie maakt een online tool en een open datamodel** voor rapporten op het
  Interoperable Europe-portaal. Voorgestelde vocabulaires zijn CPOV (organisatie),
  CPSV-AP (dienst) en CCCEV / Core Assessment Vocabulary (eisen).
  **Gevolg:** onze tool vervangt dat portaal niet. Hij helpt het assessment voor te bereiden
  en exporteert de IEA-bijlage zo, dat je die makkelijk kunt overnemen of uploaden.
- Hoofdstuk 2 heeft een **beslisboom** voor de vraag of het assessment verplicht is. Die
  boom is overgenomen in `data/iea/beslisboom.yaml`; zie [bronnen/iea.md](bronnen/iea.md).

## Wat we nu weten over NeRDS (uit de bron nagelezen)

Bron: [NederlandseDigitaleDienst/NeRDS](https://github.com/NederlandseDigitaleDienst/NeRDS),
licentie EUPL-1.2, laatste release **v0.5.0** (5 november 2026). Versies worden met
release-please uitgebracht en zijn getagd.

- **13 richtlijnen**, als Markdown in `docs/richtlijnen/<slug>/index.md`:
  1 gebruikersbehoeften, 2 toegankelijkheid, 3 open-source, 4 open-standaarden, 5 cloud,
  6 veiligheid, 7 privacy, 8 samenwerking, 9 integratie, 10 data, 11 algoritmen,
  12 inkoop, 13 duurzaamheid.
- **Elke richtlijn heeft frontmatter** met `title`, `summary` en `relations` (gerelateerde
  richtlijnen). Daaronder staan vaste koppen: "Waarom is het belangrijk?", "Hoe pas je het
  toe?", "Bewezen praktijken" (met subkoppen) en "Gerelateerde hulpmiddelen".
- **Een machine-leesbare action registry** (`docs/action-registry/actions.yaml`, met
  JSON Schema) somt ongeveer 70 hulpmiddelen op, per richtlijn en per **fase**:
  verkenning, ontwerp, bouw, productie en live.
- NeRDS heeft ook een eigen Claude Code-plugin met een skill per richtlijn. Die staat (nog)
  niet in de NLDD-marketplace.

**Gevolgen voor ons:**
- We hoeven NeRDS niet over te typen. Een importscript (`scripts/import-nerds.ts`) leest
  een getagde release en maakt daaruit `data/kaders/nerds.yaml`. De ID's komen van de slugs
  (`nerds:data`, `nerds:data/bewezen-praktijken/...`), de versie van de releasetag.
- De slugs zijn ook de meest stabiele ID's. De nummers kunnen nog verschuiven.
- De **fase** van het project wordt een contextvraag. Daarmee tonen we per aspect de
  hulpmiddelen uit de action registry die bij die fase horen.
- `relations` geeft een eerste aanzet voor de crosswalk tussen NeRDS-onderdelen.

## Fasen

### Fase 1 – Bronnen en datamodel (eerst, zonder UI)
- [x] Hoofdstuk 2 (beslisboom) en hoofdstuk 3 (stappen van het assessment) nalezen en
      samenvatten in `docs/bronnen/iea.md`
- [x] NeRDS: de bron is gevonden (zie hierboven)
- [x] `scripts/import-nerds.ts`: leest een release en maakt `data/kaders/nerds.yaml`
      en `data/hulpmiddelen/nerds.yaml`
- [x] `scripts/import-nora.ts`: NORA (NAP, KD) en GDI Gegevensuitwisseling via de SMW-API
- [x] Voor de andere kaders nagaan welke machine-leesbare bron er is (NORA, EIF, ADO, GDI),
      met een link, versie en licentie in `docs/bronnen/`
- [x] Zod-schema's: `Kader` (onderdelen met vaste ID's en bronlinks, plus versie), `Aspect`
      (bestaat al), `Assessment` (context, antwoorden per aspect, bindende eisen,
      IEA-bijlage, gebruikte kaderversies, `schemaVersie`)
- [x] Laden en valideren van `data/**/*.yaml` bij het bouwen, met een test die faalt bij
      een koppeling naar een kader-ID dat niet bestaat
- [x] Datamodel klaar voor later meerdere auteurs: elk antwoord krijgt een `id`, een tijdstip
      en een optioneel veld `auteur`

- [ ] Nog open: zie *Open punten* (ADO, EIF-aanbevelingen, licenties)

### Fase 2 – Gedeeltelijke crosswalk (het inhoudelijke werk)
- [x] Drie thema's: **hergebruik en standaarden**, **gegevens en betekenis**, **toegang en
      identificatie** (`data/themas.yaml`)
- [x] 15 aspecten (5 per thema, waarvan 3 alleen voor grensoverschrijdende diensten), elk met
      hulpvragen en koppelingen met een reden (`data/aspecten/`)
- [x] Reviewstuk met dekkingsmatrix: [crosswalk-review.md](crosswalk-review.md)
      (`npm run crosswalk`)
- [ ] Laten reviewen door een architect, bijvoorbeeld uit de NORA-community

### Fase 3 – Invulflow
- [x] Contextvragen: grensoverschrijdend ja of nee, bindende eis ja of nee (via de
      beslisboom in `data/iea/beslisboom.yaml`), soort organisatie. De antwoorden bepalen welke aspecten zichtbaar zijn
      en of de IEA-stap er is.
- [x] Navigatie per thema en per aspect, met per aspect de zes velden. "N.v.t." vraagt
      verplicht om een reden.
- [x] Voortgang: behandeld, n.v.t. of open, per thema en per kader
- [x] IEA-stap: bindende eisen, belanghebbenden, effect per EIF-laag en resultaten
- [x] Autosave in de browser, plus opslaan en inladen als JSON-bestand

### Fase 4 – Rapport
- [x] Rapportweergave in zes delen (managementsamenvatting, context, afwegingen per thema,
      dekkingsmatrix, IEA-bijlage, verantwoording)
- [x] Printstijl voor PDF via de printfunctie van de browser
- [x] Machine-leesbare export van de IEA-bijlage (JSON), zo dicht mogelijk bij het
      datamodel van de Commissie
- [x] Een vinkje voor gevoelige informatie per veld, en een geschoonde exportversie

### Fase 5 – Voorbeelden, testen en publiceren
- [x] Grensoverschrijdende casus: Europese gehandicaptenkaart en -parkeerkaart
      (`data/voorbeelden/europese-parkeerkaart.yaml`). EU-feiten uit openbare bronnen, de
      Nederlandse uitvoering en de keuzes zijn fictief.
- [x] Nationale casus: vervanging van een subsidiesysteem bij een fictieve zbo
      (`data/voorbeelden/subsidiesysteem.yaml`). Volledig fictief, geïnspireerd op terugkerende
      thema's in openbare AC-ICT-adviezen; niet op één project. Geen Gateway Reviews: vertrouwelijk.
- [ ] Testen met een paar echte invullers
- [x] Publiceren op GitHub Pages: https://patrickknoester.github.io/NeRDS-IEA-assessment/

## Open punten

Stand 11 november 2026. Op volgorde van belang.

### Inhoud
- [ ] **Crosswalk laten reviewen** door architecten (bijv. NORA-community, NLDD, EIF-kenners).
      Basis: [crosswalk-review.md](crosswalk-review.md). Let vooral op koppelingen die op eigen
      lezing berusten, zoals once-only onder EIF-principe 6.
- [ ] **Meer thema's** dan hergebruik, gegevens en toegang. Kandidaten uit het brief:
      gebruikers, veiligheid en privacy, juridisch, governance. Daarmee stijgt ook de dekking
      van NeRDS (nu 11 van 13) en NORA (19 van 37).
- [ ] **ADO overnemen.** Alleen een PDF gevonden (versie 20240206). Vragen of er een
      ArchiMate-model of andere export bestaat.
- [ ] **EIF-aanbevelingen 1–47** toevoegen aan `data/kaders/eif.yaml` (nu alleen lagen en
      principes).
- [ ] **Meer GDI-domeinen.** Nu alleen Gegevensuitwisseling (met principes) en
      Identificatie en authenticatie (alleen domein). Machtigen en andere domeinen ontbreken.
- [ ] **Licenties nagaan** van NORA-, EU- en ADO-teksten. Tot die tijd alleen ID's, titels en
      links overnemen.

### Testen en gebruik
- [ ] **Testen met echte invullers**, met een grensoverschrijdende en een lokale dienst.
- [ ] Rapport een keer echt als **PDF** afdrukken en controleren (de werking is getest, de
      opmaak op papier nog niet).
- [ ] Toetsen op **toegankelijkheid**: toetsenbord, 200% zoom, 400% herschaling, schermlezer.

### Techniek
- [ ] **IEA-export** aanpassen zodra het datamodel van de Commissie voor assessmentrapporten
      is gepubliceerd (nu een voorlopig eigen formaat, `iea-assessment-poc/annex/v0`).
- [ ] **Migraties** voor het opslagformaat zodra `SCHEMA_VERSIE` omhoog moet.
- [ ] Bundel kleiner maken (nu ~2 MB, alle NLDD-componenten): de autoloader van het
      designsysteem gebruiken.
- [ ] Eén oude CI-run (fase 4, #43095347365) bleef na de GitHub-storing van 11 november
      hangen en is niet te annuleren. Draait hij alsnog, dan staat er een oudere versie live:
      publiceer dan opnieuw met `gh workflow run pages.yml`.
- [ ] Lokaal staat een onbekend bestand `public/favicon 2.svg` (niet gecommit); weggooien
      als het niet nodig is.

### Bestuurlijk (uit het brief)
- [ ] **Eigenaarschap van de crosswalk** op de lange termijn: wie beheert hem officieel?
- [ ] **Samenwerken** met meerdere invullers en reviewers (datamodel is erop voorbereid:
      `auteur` per antwoord; vraagt om opslag op een server, bijv. ZAD).
- [ ] **Aansluiting op het Interoperable Europe-portaal**: formaat en metadata voor publicatie.
- [ ] **Plek van de repo**: nu `patrickknoester/NeRDS-IEA-assessment` (openbaar). Verhuizen
      naar MinBZK of NLDD als het meer wordt dan een experiment.

### Besloten
- Thema's: hergebruik en standaarden, gegevens en betekenis, toegang en identificatie.
- Voorbeelden: Europese gehandicapten- en parkeerkaart (grensoverschrijdend) en een fictief
  subsidiesysteem (nationaal, geïnspireerd op AC-ICT-adviezen). Geen Gateway Reviews: vertrouwelijk.
- Repo openbaar onder EUPL-1.2, gepubliceerd op GitHub Pages.
