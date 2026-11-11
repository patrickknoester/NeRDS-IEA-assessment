# Bronnen per kader

Stand: 11 november 2026. Per kader: waar staat de bron, is die machine-leesbaar, welke ID's
gebruiken we en hoe krijgen we hem in `data/kaders/`.

| Kader | Bron | Machine-leesbaar | ID's | Import |
|---|---|---|---|---|
| NeRDS | [GitHub NeRDS](https://github.com/NederlandseDigitaleDienst/NeRDS), EUPL-1.2, v0.5.0 | Ja: Markdown met frontmatter, `actions.yaml` met JSON Schema | slug van de richtlijn (`data`, `privacy`) | Script, per releasetag |
| NORA | [NORA Online](https://www.noraonline.nl) (Semantic MediaWiki) | Ja: `api.php?action=ask` geeft JSON | `NAP01`–`NAP17` (architectuurprincipes), `KD01`–`KD20` (kwaliteitsdoelen) | Script via de SMW-API, met de wijzigingsdatum als versie |
| GDI-domeinarchitecturen | NORA Online, ArchiMate-modellen (CoArchi-import); daarnaast PDF's | Deels: de principes van het domein Gegevensuitwisseling staan als ArchiMate `Principle` in NORA (1.1–6.1, 21 stuks) | nummer van het principe (`gu-1.1`) | Script via de SMW-API; andere domeinen eerst handmatig uit PDF |
| ADO (Architectuur Digitale Overheid) | [PDF versie 20240206](https://noraonline.nl/images/noraonline/8/89/Architectuur_Digitale_Overheid_-_versie_20240206_-_NORA_Gebruikersraad.pdf) op NORA Online | Nee (nog niet gevonden) | nog bepalen | Handmatig overnemen, met versie en paginanummer |
| EIF | [EIF-aanbevelingen](https://interoperable-europe.ec.europa.eu/collection/nifo-national-interoperability-framework-observatory/solution/eif-toolbox/eif-recommendations) (COM(2017) 134, bijlage 2) | Nee: 12 principes en 47 aanbevelingen als webpagina/PDF | `eif-p1`–`eif-p12`, `eif-r1`–`eif-r47`, plus de lagen `juridisch`, `organisatorisch`, `semantisch`, `technisch` en `governance` | Handmatig overnemen (stabiel sinds 2017) |
| IEA | Verordening (EU) 2024/903 en de [richtlijnen](https://interoperable-europe.ec.europa.eu/collection/assessments/assessment-guidelines), zie [iea.md](iea.md) | Nee; het datamodel van de Commissie voor rapporten is aangekondigd maar nog niet gevonden | `art-3`, `bijlage-1`…, `beslisboom-1`…`6` | Handmatig overnemen |

## Aandachtspunten

- **NORA is in transitie.** De oude basisprincipes (BP01–BP10) en afgeleide principes
  (AP01–AP44) zijn *uitgefaseerd*. Gebruik de **NAP's** en de **kwaliteitsdoelen**. Neem de
  status uit de API mee, zodat we een kaderonderdeel als "uitgefaseerd" kunnen tonen als een
  oud assessment ernaar verwijst.
- **Versie bij bronnen zonder releases.** Voor NORA (wiki) leggen we per onderdeel de
  wijzigingsdatum vast, en voor het hele kader de datum van de import.
- **ADO en GDI** worden ook door de NORA-community beheerd. Vraag bij de review (fase 2)
  of er een ArchiMate-model of andere export van de ADO bestaat.
- **Licenties:** NeRDS EUPL-1.2. Voor NORA, de EU-bronnen en de ADO de licentie nog
  nagaan voordat we teksten letterlijk overnemen. Tot die tijd nemen we alleen ID's,
  titels en bronlinks op, geen volledige teksten.
