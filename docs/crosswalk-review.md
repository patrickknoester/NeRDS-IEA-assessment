# Crosswalk: voorstel voor review

> Gegenereerd met `node scripts/crosswalk-review.ts` uit `data/`. Niet met de hand bewerken.

Deze crosswalk koppelt **aspecten** (vragen in het assessment) aan de onderdelen van de kaders.
Wie een aspect invult, behandelt daarmee alle gekoppelde kaderonderdelen tegelijk.
Dit is een **eerste voorstel** voor drie thema's. Bij elke koppeling staat waarom hij er volgens ons bij hoort.

**Vragen aan reviewers**

1. Klopt elke koppeling? Ontbreken er koppelingen die voor de hand liggen?
2. Zijn de aspecten goed afgebakend: niet te groot, niet overlappend?
3. Zijn de hulpvragen bruikbaar voor iemand zonder architectuurachtergrond?
4. Welke kaderonderdelen in de dekkingsmatrix horen wél bij deze thema's, maar zijn nog niet gekoppeld?

## Gebruikte kaderversies

| Kader | Versie | Bron | Herkomst |
|---|---|---|---|
| IEA | 2024/903 + richtlijnen 2025-01-08 | https://eur-lex.europa.eu/eli/reg/2024/903/oj | handmatig, zie docs/bronnen/iea.md |
| EIF | 2017 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52017DC0134 | handmatig, zie docs/bronnen/kaders.md |
| NeRDS | v0.5.0 | https://github.com/NederlandseDigitaleDienst/NeRDS/tree/v0.5.0 | scripts/import-nerds.ts |
| GDI | 2026-11-11 | https://www.noraonline.nl | scripts/import-nora.ts |
| NORA | 2026-11-11 | https://www.noraonline.nl | scripts/import-nora.ts |

## Thema: Hergebruik en standaarden

_Bouw je voort op wat er al is, en maak je het voor anderen herbruikbaar?_

### Hergebruik van bestaande voorzieningen

`hergebruik-voorzieningen` · Welke bestaande bouwstenen, voorzieningen en diensten gebruikt de dienst, en waar kies je ervoor om iets nieuws te maken of te kopen?

- Welke generieke voorzieningen (GDI) en bouwstenen van andere overheden heb je bekeken?
- Waarom voldeed een bestaande oplossing niet, als je zelf iets maakt of koopt?

| Kader | Onderdeel | Waarom |
|---|---|---|
| IEA | Hergebruik van (Interoperable Europe-)oplossingen beoordelen (`hergebruik-oplossingen`) | Het assessment moet de herbruikbaarheid van bestaande oplossingen beoordelen |
| EIF | Herbruikbaarheid (`principe/4`) | Onderliggend principe Herbruikbaarheid |
| EIF | Technische interoperabiliteit (`laag/technisch`) | Hergebruik van technische bouwstenen |
| NeRDS | 8. Deel, hergebruik en werk samen (`samenwerking`) | Delen, hergebruiken en samenwerken tussen overheden |
| GDI | 4.1 Gegevens worden geleverd vanuit herbruikbare gegevensdiensten (`gegevensuitwisseling/4.1`) | Gegevens leveren vanuit herbruikbare gegevensdiensten |
| NORA | Hergebruik vóór kopen vóór maken (`nap06`) | Hergebruik vóór kopen vóór maken is precies deze afweging |
| NORA | Bouw diensten modulair op (`nap07`) | Modulaire opbouw maakt hergebruik van onderdelen mogelijk |

### Gebruik van open standaarden

`open-standaarden` · Welke standaarden gebruikt de dienst voor gegevens, koppelingen en techniek, en volg je de lijst van het Forum Standaardisatie?

- Welke standaarden van de 'pas toe of leg uit'-lijst zijn van toepassing?
- Waar wijk je af van een verplichte standaard, en waarom?

| Kader | Onderdeel | Waarom |
|---|---|---|
| IEA | Resultaten (Interoperable Europe-oplossingen, andere oplossingen, resterende belemmeringen) (`bijlage/resultaten`) | Gebruikte interoperabiliteitsoplossingen, waaronder standaarden, komen in het rapport |
| EIF | Openheid (`principe/2`) | Openheid, waaronder open specificaties |
| EIF | Technologische neutraliteit en dataportabiliteit (`principe/5`) | Technologische neutraliteit en dataportabiliteit |
| EIF | Semantische interoperabiliteit (`laag/semantisch`) | Standaarden voor gegevens en betekenis |
| EIF | Technische interoperabiliteit (`laag/technisch`) | Standaarden voor koppelingen en protocollen |
| NeRDS | 4. Gebruik open standaarden (`open-standaarden`) | NeRDS-richtlijn Open Standaarden |
| GDI | 1.2 Gegevensuitwisseling is gebaseerd op open standaarden (`gegevensuitwisseling/1.2`) | Gegevensuitwisseling is gebaseerd op open standaarden |
| NORA | Standaardiseer waar mogelijk (`nap08`) | Standaardiseer waar mogelijk |

### Openbaar maken en delen van wat je maakt

`open-source-delen` · Maak je broncode, specificaties en documentatie openbaar, zodat anderen ze kunnen hergebruiken?

- Onder welke licentie publiceer je de broncode?
- Welke delen kun je niet openbaar maken, en waarom niet?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Openheid (`principe/2`) | Openheid |
| EIF | Herbruikbaarheid (`principe/4`) | Herbruikbaarheid: oplossingen beschikbaar stellen voor anderen |
| NeRDS | 3. Werk transparant en gebruik open source (`open-source`) | Werk transparant en gebruik open source |
| NeRDS | 8. Deel, hergebruik en werk samen (`samenwerking`) | Delen met andere overheden |
| NORA | Transparant (`kd01`) | Kwaliteitsdoel Transparant |

### Wendbaarheid en onafhankelijkheid van leveranciers

`wendbaarheid-leveranciers` · Kun je later overstappen naar een andere leverancier of oplossing, en houd je regie over je gegevens en techniek?

- Wat is je exitstrategie, en kun je je gegevens in een open formaat meenemen?
- Hoe heb je digitale autonomie meegewogen bij de keuze voor cloud of SaaS?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Technologische neutraliteit en dataportabiliteit (`principe/5`) | Technologische neutraliteit en dataportabiliteit |
| NeRDS | 5. Gebruik cloud verantwoord en blijf wendbaar (`cloud`) | Gebruik cloud verantwoord en blijf wendbaar |
| NeRDS | 12. Definieer je inkoopstrategie (`inkoop`) | De inkoopstrategie bepaalt de afhankelijkheid van leveranciers |
| NORA | Wendbaar (`kd09`) | Kwaliteitsdoel Wendbaar |
| NORA | Voorkom onnodige complexiteit (`nap16`) | Voorkom onnodige complexiteit, die tot afhankelijkheid leidt |

### Interoperable Europe-oplossingen 🇪🇺 _alleen bij grensoverschrijdende diensten_

`interoperable-europe-oplossingen` · Welke oplossingen die de Interoperable Europe Board aanbeveelt (standaarden, bouwstenen, kernvocabulaires) zijn bruikbaar voor de grensoverschrijdende kant van de dienst?

- Welke Interoperable Europe-oplossingen heb je bekeken? Noteer het ook als er geen bruikbaar was.
- Welke andere Europese of nationale catalogi heb je doorzocht?

| Kader | Onderdeel | Waarom |
|---|---|---|
| IEA | Hergebruik van (Interoperable Europe-)oplossingen beoordelen (`hergebruik-oplossingen`) | Verplichte beoordeling van Interoperable Europe-oplossingen |
| IEA | Resultaten (Interoperable Europe-oplossingen, andere oplossingen, resterende belemmeringen) (`bijlage/resultaten`) | De gebruikte oplossingen komen in het rapport |
| EIF | Herbruikbaarheid (`principe/4`) | Herbruikbaarheid |

## Thema: Gegevens en betekenis

_Hoe kom je aan je gegevens, wat betekenen ze, en hoe ga je er zorgvuldig mee om?_

### Gegevens bij de bron ophalen

`gegevens-bij-de-bron` · Haalt de dienst gegevens op bij de bronregistratie op het moment dat ze nodig zijn, in plaats van ze opnieuw uit te vragen of te kopiëren?

- Welke gegevens vraag je nog aan de gebruiker die de overheid al heeft?
- Waar maak je kopieën van brongegevens, en hoe houd je die actueel?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Gebruikersgerichtheid (`principe/6`) | Gebruikersgerichtheid, waaronder het once-only-principe |
| EIF | Organisatorische interoperabiliteit (`laag/organisatorisch`) | Afspraken tussen bronhouder en afnemer |
| NeRDS | 10. Maak beter gebruik van data (`data`) | Maak beter gebruik van data |
| NeRDS | 9. Integreer en pas technologie aan (`integratie`) | Koppelingen met bronnen |
| GDI | 1.5 Gegevens worden in de bron beheerd en worden via een bijbehorend verstrekkingspunt verkregen op het moment dat ze nodig zijn (`gegevensuitwisseling/1.5`) | Gegevens worden in de bron beheerd en via een verstrekkingspunt verkregen |
| GDI | 4.1 Gegevens worden geleverd vanuit herbruikbare gegevensdiensten (`gegevensuitwisseling/4.1`) | Herbruikbare gegevensdiensten |
| NORA | Informeer bij de bron (`nap12`) | Informeer bij de bron |
| NORA | Neem gegevens als fundament (`nap10`) | Neem gegevens als fundament |

### Gedeelde begrippen en betekenis van gegevens

`begrippen-en-betekenis` · Is vastgelegd wat de gegevens betekenen, met welke begrippen en modellen, zodat afnemers ze op dezelfde manier begrijpen?

- Welke begrippenkaders en informatiemodellen hergebruik je?
- Publiceer je metagegevens, bijvoorbeeld als Linked Data?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Semantische interoperabiliteit (`laag/semantisch`) | Semantische interoperabiliteit: betekenis blijft behouden |
| NeRDS | 10. Maak beter gebruik van data (`data`) | Maak beter gebruik van data |
| NeRDS | 4. Gebruik open standaarden (`open-standaarden`) | Semantische standaarden |
| GDI | 3.1 Gemeenschappelijke begripsvorming is het startpunt (`gegevensuitwisseling/3.1`) | Gemeenschappelijke begripsvorming is het startpunt |
| GDI | 3.2 Metagegevens zijn begrijpelijk voor mensen (`gegevensuitwisseling/3.2`) | Metagegevens zijn begrijpelijk voor mensen |
| GDI | 3.4 Metagegevens zijn aan elkaar verbonden (`gegevensuitwisseling/3.4`) | Metagegevens zijn aan elkaar verbonden |
| GDI | 3.5 Metagegevens zijn beschikbaar als Linked Data (`gegevensuitwisseling/3.5`) | Metagegevens zijn beschikbaar als Linked Data |
| NORA | Neem gegevens als fundament (`nap10`) | Neem gegevens als fundament |
| NORA | Begrijpelijk (`kd15`) | Kwaliteitsdoel Begrijpelijk |

### Kwaliteit van gegevens

`gegevenskwaliteit` · Is de kwaliteit van de gegevens bekend, beschreven en passend voor het gebruik in deze dienst?

- Hoe beschrijf je de kwaliteit, bijvoorbeeld volgens het landelijke raamwerk gegevenskwaliteit?
- Hoe meld je fouten terug aan de bronhouder?

| Kader | Onderdeel | Waarom |
|---|---|---|
| NeRDS | 10. Maak beter gebruik van data (`data`) | Maak beter gebruik van data |
| GDI | 1.3 De kwaliteit van gegevens is afgestemd op het gebruik (`gegevensuitwisseling/1.3`) | De kwaliteit van gegevens is afgestemd op het gebruik |
| GDI | 3.6 De kwaliteit van gegevens is beschreven conform het landelijke raamwerk gegevenskwaliteit (`gegevensuitwisseling/3.6`) | Kwaliteit beschreven volgens het landelijke raamwerk |
| GDI | 6.1 Gegevens worden zo vroeg mogelijk gevalideerd (`gegevensuitwisseling/6.1`) | Gegevens worden zo vroeg mogelijk gevalideerd |
| NORA | Betrouwbaar (`kd02`) | Kwaliteitsdoel Betrouwbaar |
| NORA | Stuur cyclisch op kwaliteit (`nap17`) | Stuur cyclisch op kwaliteit |

### Doelbinding en bescherming van gegevens

`doelbinding-en-bescherming` · Gebruikt de dienst alleen de gegevens die nodig zijn voor het doel, en zijn gevoelige gegevens beschermd bij opslag en uitwisseling?

- Is er een DPIA gedaan, en wat kwam daaruit?
- Welke gegevens kun je weglaten of minder precies vragen?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Beveiliging en privacy (`principe/8`) | Beveiliging en privacy |
| EIF | Juridische interoperabiliteit (`laag/juridisch`) | Grondslag voor verwerking |
| NeRDS | 7. Maak privacy integraal (`privacy`) | Maak privacy integraal |
| GDI | 1.6 Burgers en organisaties hebben regie over hun eigen gegevens (`gegevensuitwisseling/1.6`) | Burgers en organisaties hebben regie over hun eigen gegevens |
| GDI | 1.7 Gevoelige gegevens zijn beschermd bij het uitwisselen van gegevens (`gegevensuitwisseling/1.7`) | Gevoelige gegevens zijn beschermd bij uitwisseling |
| NORA | Pas doelbinding toe (`nap11`) | Pas doelbinding toe |
| NORA | Privacy (`kd05`) | Kwaliteitsdoel Privacy |

### Gegevens delen over de grens 🇪🇺 _alleen bij grensoverschrijdende diensten_

`grensoverschrijdende-gegevensdeling` · Is er een wettelijke grondslag en zijn er afspraken om gegevens te delen met overheden in andere lidstaten of EU-instellingen, en begrijpen die de gegevens op dezelfde manier?

- Geeft de eis een grondslag om gegevens over de grens te delen, en is die duidelijk?
- Gebruik je Europese kernvocabulaires, en hoe ga je om met verschillende talen?

| Kader | Onderdeel | Waarom |
|---|---|---|
| IEA | Eisen (diensten, bindende eisen, belanghebbenden, effecten per EIF-laag) (`bijlage/eisen`) | Het effect op juridische en semantische interoperabiliteit komt in het rapport |
| EIF | Juridische interoperabiliteit (`laag/juridisch`) | Juridische grondslag voor grensoverschrijdende uitwisseling |
| EIF | Semantische interoperabiliteit (`laag/semantisch`) | Betekenis blijft behouden over de grens |
| EIF | Meertaligheid (`principe/9`) | Meertaligheid |
| GDI | 2.2 Voorwaarden en afspraken zijn expliciet en inzichtelijk (`gegevensuitwisseling/2.2`) | Voorwaarden en afspraken zijn expliciet en inzichtelijk |

## Thema: Toegang en identificatie

_Wie krijgt toegang tot de dienst, en hoe weet je wie dat is?_

### Identificatie en authenticatie van gebruikers

`identificatie-authenticatie` · Hoe stelt de dienst vast wie de gebruiker is, en op welk betrouwbaarheidsniveau?

- Welke inlogmiddelen ondersteun je (bijv. DigiD, eHerkenning), en welk betrouwbaarheidsniveau is nodig?
- Gebruik je de generieke voorzieningen, of bouw je zelf iets?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Beveiliging en privacy (`principe/8`) | Beveiliging en privacy |
| EIF | Technische interoperabiliteit (`laag/technisch`) | Technische koppeling met inlogvoorzieningen |
| NeRDS | 6. Maak veilige systemen (`veiligheid`) | NeRDS-richtlijn Veiligheid |
| GDI | Domeinarchitectuur Identificatie en authenticatie (`identificatie-authenticatie`) | GDI-domeinarchitectuur Identificatie en authenticatie |
| NORA | Verifieer altijd (`nap14`) | Verifieer altijd |
| NORA | Vertrouwelijk (`kd08`) | Kwaliteitsdoel Vertrouwelijk |

### Machtigen en vertegenwoordigen

`machtigen-en-vertegenwoordigen` · Kunnen mensen en organisaties iemand anders laten handelen namens hen, en hoe controleert de dienst dat?

- Voor welke gebruikers is vertegenwoordiging nodig (bijv. ouders, bewindvoerders, intermediairs)?
- Welke machtigingsvoorziening gebruik je?

| Kader | Onderdeel | Waarom |
|---|---|---|
| NeRDS | 1. Stel gebruikersbehoeften vast (`gebruikersbehoeften`) | Niet iedereen kan of wil zelf handelen |
| NeRDS | 2. Zorg voor toegankelijkheid en inclusie (`toegankelijkheid`) | Inclusie: hulp bij het gebruik van de dienst |
| GDI | Domeinarchitectuur Identificatie en authenticatie (`identificatie-authenticatie`) | Grenst aan identificatie en authenticatie; een apart GDI-domein voor machtigen is nog niet geïmporteerd |
| NORA | Verplaats je in de gebruiker (`nap01`) | Verplaats je in de gebruiker |
| NORA | Verifieer altijd (`nap14`) | Verifieer altijd, ook de bevoegdheid |

### Vertrouwen en toegang tussen systemen

`vertrouwen-tussen-organisaties` · Hoe weten de systemen van organisaties wie ze voor zich hebben, en welke afspraken gelden voor toegang tot elkaars gegevens en diensten?

- Welke koppelvoorziening en welke certificaten gebruik je?
- Hoe leg je vast wie welke gegevens mag opvragen?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Technische interoperabiliteit (`laag/technisch`) | Veilig en betrouwbaar verbinden |
| EIF | Organisatorische interoperabiliteit (`laag/organisatorisch`) | Afspraken tussen organisaties |
| NeRDS | 6. Maak veilige systemen (`veiligheid`) | NeRDS-richtlijn Veiligheid |
| NeRDS | 9. Integreer en pas technologie aan (`integratie`) | Koppelingen tussen systemen |
| GDI | 1.8 Vertrouwen in gegevensuitwisseling is gebaseerd op verifieerbare verklaringen (`gegevensuitwisseling/1.8`) | Vertrouwen is gebaseerd op verifieerbare verklaringen |
| GDI | 2.1 Gegevensuitwisseling is federatief georganiseerd (`gegevensuitwisseling/2.1`) | Gegevensuitwisseling is federatief georganiseerd |
| NORA | Verifieer altijd (`nap14`) | Verifieer altijd |
| NORA | Beheers risico's voortdurend (`nap13`) | Beheers risico's voortdurend |

### Toegankelijkheid en inclusie

`toegankelijk-en-inclusief` · Kan iedereen de dienst gebruiken, ook mensen met een beperking, met weinig digitale vaardigheden of zonder inlogmiddel?

- Voldoet de dienst aan de toegankelijkheidseisen, en is er een toegankelijkheidsverklaring?
- Welk alternatief is er voor wie de digitale weg niet kan gebruiken?

| Kader | Onderdeel | Waarom |
|---|---|---|
| EIF | Inclusie en toegankelijkheid (`principe/7`) | Inclusie en toegankelijkheid |
| NeRDS | 2. Zorg voor toegankelijkheid en inclusie (`toegankelijkheid`) | Zorg voor toegankelijkheid en inclusie |
| NeRDS | 1. Stel gebruikersbehoeften vast (`gebruikersbehoeften`) | Stel gebruikersbehoeften vast |
| NORA | Toegankelijk (`kd14`) | Kwaliteitsdoel Toegankelijk |
| NORA | Verplaats je in de gebruiker (`nap01`) | Verplaats je in de gebruiker |
| NORA | Lever een kanaal-onafhankelijk resultaat (`nap03`) | Lever een kanaal-onafhankelijk resultaat |

### Toegang voor gebruikers uit andere lidstaten 🇪🇺 _alleen bij grensoverschrijdende diensten_

`toegang-uit-andere-lidstaten` · Kunnen burgers en bedrijven uit andere lidstaten de dienst gebruiken, met hun eigen erkende inlogmiddel en in een taal die ze begrijpen?

- Ondersteun je inlogmiddelen uit andere lidstaten via eIDAS?
- In welke talen is de dienst beschikbaar?

| Kader | Onderdeel | Waarom |
|---|---|---|
| IEA | Eisen (diensten, bindende eisen, belanghebbenden, effecten per EIF-laag) (`bijlage/eisen`) | Effect op grensoverschrijdende interoperabiliteit en de geraakte belanghebbenden |
| EIF | Inclusie en toegankelijkheid (`principe/7`) | Inclusie en toegankelijkheid |
| EIF | Meertaligheid (`principe/9`) | Meertaligheid |
| EIF | Juridische interoperabiliteit (`laag/juridisch`) | Wederzijdse erkenning van inlogmiddelen |
| GDI | Domeinarchitectuur Identificatie en authenticatie (`identificatie-authenticatie`) | GDI-domeinarchitectuur Identificatie en authenticatie |

## Dekkingsmatrix

Per kaderonderdeel: in hoeveel aspecten per thema het voorkomt. Een leeg vak is niet per se een fout:
de POC werkt nog maar drie thema's uit. Uitgefaseerde onderdelen zijn weggelaten.

### Interoperable Europe Act (IEA 2024/903 + richtlijnen 2025-01-08)

| Onderdeel | Hergebruik en standaarden | Gegevens en betekenis | Toegang en identificatie |
|---|:-:|:-:|:-:|
| Interoperabiliteitsassessment |  |  |  |
| Inhoud van het assessmentrapport |  |  |  |
| Algemene informatie (organisatie, initiatief) |  |  |  |
| Eisen (diensten, bindende eisen, belanghebbenden, effecten per EIF-laag) |  | 1 | 1 |
| Resultaten (Interoperable Europe-oplossingen, andere oplossingen, resterende belemmeringen) | 2 |  |  |
| Hergebruik van (Interoperable Europe-)oplossingen beoordelen | 2 |  |  |
| Directe afnemers en belanghebbenden raadplegen |  |  |  |

**3 van 7** onderdelen gekoppeld.

### European Interoperability Framework (EIF 2017)

| Onderdeel | Hergebruik en standaarden | Gegevens en betekenis | Toegang en identificatie |
|---|:-:|:-:|:-:|
| Juridische interoperabiliteit |  | 2 | 1 |
| Organisatorische interoperabiliteit |  | 1 | 1 |
| Semantische interoperabiliteit | 1 | 2 |  |
| Technische interoperabiliteit | 2 |  | 2 |
| Interoperabiliteitsgovernance |  |  |  |
| Governance van geïntegreerde publieke dienstverlening |  |  |  |
| Subsidiariteit en proportionaliteit |  |  |  |
| Openheid | 2 |  |  |
| Transparantie |  |  |  |
| Herbruikbaarheid | 3 |  |  |
| Technologische neutraliteit en dataportabiliteit | 2 |  |  |
| Gebruikersgerichtheid |  | 1 |  |
| Inclusie en toegankelijkheid |  |  | 2 |
| Beveiliging en privacy |  | 1 | 1 |
| Meertaligheid |  | 1 | 1 |
| Administratieve vereenvoudiging |  |  |  |
| Bewaring van informatie |  |  |  |
| Beoordeling van doeltreffendheid en efficiëntie |  |  |  |

**11 van 18** onderdelen gekoppeld.

### Nederlandse Richtlijn Digitale Systemen (NeRDS v0.5.0)

| Onderdeel | Hergebruik en standaarden | Gegevens en betekenis | Toegang en identificatie |
|---|:-:|:-:|:-:|
| 1. Stel gebruikersbehoeften vast |  |  | 2 |
| 2. Zorg voor toegankelijkheid en inclusie |  |  | 2 |
| 3. Werk transparant en gebruik open source | 1 |  |  |
| 4. Gebruik open standaarden | 1 | 1 |  |
| 5. Gebruik cloud verantwoord en blijf wendbaar | 1 |  |  |
| 6. Maak veilige systemen |  |  | 2 |
| 7. Maak privacy integraal |  | 1 |  |
| 8. Deel, hergebruik en werk samen | 2 |  |  |
| 9. Integreer en pas technologie aan |  | 1 | 1 |
| 10. Maak beter gebruik van data |  | 3 |  |
| 11. Pas algoritmen verantwoord toe |  |  |  |
| 12. Definieer je inkoopstrategie | 1 |  |  |
| 13. Maak je technologie duurzaam |  |  |  |

**11 van 13** onderdelen gekoppeld.

### GDI-domeinarchitecturen (GDI 2026-11-11)

| Onderdeel | Hergebruik en standaarden | Gegevens en betekenis | Toegang en identificatie |
|---|:-:|:-:|:-:|
| Domeinarchitectuur Gegevensuitwisseling |  |  |  |
| 1.1 Gegevens die kunnen worden gedeeld zijn vindbaar, toegankelijk, interoperabel en herbruikbaar |  |  |  |
| 1.2 Gegevensuitwisseling is gebaseerd op open standaarden | 1 |  |  |
| 1.3 De kwaliteit van gegevens is afgestemd op het gebruik |  | 1 |  |
| 1.4 Gegevensdiensten zijn afgestemd op de behoeften van afnemers |  |  |  |
| 1.5 Gegevens worden in de bron beheerd en worden via een bijbehorend verstrekkingspunt verkregen op het moment dat ze nodig zijn |  | 1 |  |
| 1.6 Burgers en organisaties hebben regie over hun eigen gegevens |  | 1 |  |
| 1.7 Gevoelige gegevens zijn beschermd bij het uitwisselen van gegevens |  | 1 |  |
| 1.8 Vertrouwen in gegevensuitwisseling is gebaseerd op verifieerbare verklaringen |  |  | 1 |
| 2.1 Gegevensuitwisseling is federatief georganiseerd |  |  | 1 |
| 2.2 Voorwaarden en afspraken zijn expliciet en inzichtelijk |  | 1 |  |
| 3.1 Gemeenschappelijke begripsvorming is het startpunt |  | 1 |  |
| 3.2 Metagegevens zijn begrijpelijk voor mensen |  | 1 |  |
| 3.3 Gegevens worden contextrijk vastgelegd |  |  |  |
| 3.4 Metagegevens zijn aan elkaar verbonden |  | 1 |  |
| 3.5 Metagegevens zijn beschikbaar als Linked Data |  | 1 |  |
| 3.6 De kwaliteit van gegevens is beschreven conform het landelijke raamwerk gegevenskwaliteit |  | 1 |  |
| 4.1 Gegevens worden geleverd vanuit herbruikbare gegevensdiensten | 1 | 1 |  |
| 4.2 Registraties bieden historische gegevens aan |  |  |  |
| 4.3 Organisaties kunnen notificeren over belangrijke gebeurtenissen |  |  |  |
| 5.1 Informatieproducten zijn herleidbaar naar de onderliggende gegevens en regels |  |  |  |
| 6.1 Gegevens worden zo vroeg mogelijk gevalideerd |  | 1 |  |
| Domeinarchitectuur Identificatie en authenticatie |  |  | 3 |

**16 van 23** onderdelen gekoppeld.

### Nederlandse Overheid Referentie Architectuur (NORA 2026-11-11)

| Onderdeel | Hergebruik en standaarden | Gegevens en betekenis | Toegang en identificatie |
|---|:-:|:-:|:-:|
| Transparant | 1 |  |  |
| Betrouwbaar |  | 1 |  |
| Ontvankelijk |  |  |  |
| Verantwoord |  |  |  |
| Privacy |  | 1 |  |
| Beschikbaar |  |  |  |
| Integer |  |  |  |
| Vertrouwelijk |  |  | 1 |
| Wendbaar | 1 |  |  |
| Innovatief |  |  |  |
| Duurzaam |  |  |  |
| Proactief |  |  |  |
| Gebundeld |  |  |  |
| Toegankelijk |  |  | 1 |
| Begrijpelijk |  | 1 |  |
| Overzichtelijk |  |  |  |
| Vindbaar |  |  |  |
| Uniform |  |  |  |
| Noodzakelijk |  |  |  |
| Kostenefficiënt |  |  |  |
| Verplaats je in de gebruiker |  |  | 2 |
| Geef inzicht in de afhandeling van de dienst |  |  |  |
| Lever een kanaal-onafhankelijk resultaat |  |  | 1 |
| Bundel diensten |  |  |  |
| Bied de dienst proactief aan |  |  |  |
| Hergebruik vóór kopen vóór maken | 1 |  |  |
| Bouw diensten modulair op | 1 |  |  |
| Standaardiseer waar mogelijk | 1 |  |  |
| Beschrijf de dienst nauwkeurig |  |  |  |
| Neem gegevens als fundament |  | 2 |  |
| Pas doelbinding toe |  | 1 |  |
| Informeer bij de bron |  | 1 |  |
| Beheers risico's voortdurend |  |  | 1 |
| Verifieer altijd |  |  | 3 |
| Maak diensten schaalbaar |  |  |  |
| Voorkom onnodige complexiteit | 1 |  |  |
| Stuur cyclisch op kwaliteit |  | 1 |  |

**19 van 37** onderdelen gekoppeld.
