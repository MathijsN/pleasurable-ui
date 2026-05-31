# Snappthis - Design Challenge
In sprint 8 hebben we de opdracht gekregen om een website/webapplicatie te ontwikkelen voor een opdrachtgever. De eerste drie sprints (sprint 8, 9 en 10) waren individueel. Tijdens deze laatste sprint, sprint 11, moesten we samenwerken in één repository. De website/webapplicatie is gemaakt door [Mathijs](https://github.com/MathijsN), [Tom](https://github.com/TZGaming/),
[Yassine](https://github.com/yassineAk1/) en [Sieuwke](https://github.com/sieuwkesheta/).

De data komt uit de [FDND Directus database - Snappthis](https://fdnd-agency.directus.app/items/snappthis_snap). Deze data wordt opgehaald en kan worden toegevoegd via interacties. De styling is gebaseerd op [ontwerpen van de opdrachtgever](https://www.figma.com/design/0sXvjvqboOmfDuFMUcRHJh/2025snappthisDesign?t=q5HofcOL5AwlVT9m-0).

De website is gebouwd met NodeJS, Express, JSON en Liquid, volgens het principe van progressive enhancement. Dit houdt in dat de website eerst functioneel is zonder CSS en JavaScript, en daarna laag voor laag wordt verbeterd.

#### Wat is Snappthis?
Snappthis is een mobiele webapplicatie waarmee gebruikers foto's delen binnen
zogenoemde snappmaps. Een gebruiker wordt uitgenodigd in een groep; die groep kan
meerdere snappmaps bevatten. Een begeleider, bijvoorbeeld een docent, maakt een
snappmap aan en geeft deze een thema of opdracht. Deelnemers delen hierin zelfgemaakte
foto's, die dienen als inspiratie- en gespreksonderwerp vanuit de echte wereld.


## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
<!-- Bij Beschrijving staat kort beschreven wat voor project het is en wat je hebt gemaakt -->
<!-- Voeg een mooie poster visual toe 📸 -->
<!-- Voeg een link toe naar Github Pages 🌐-->

Voor het ontwerpen en bouwen van de website/webapplicatie hebben wij ons in sprint 11 gericht op het samenvoegen van de individuele sprints in één gezamenlijke repository.

De website/webapplicatie bestaat uit de volgende pagina's:
- Een loginpagina, homepagina en gebruikerspagina
- Een groepenoverzicht, snappmap-overzichten en detailpagina's per snapp
- Overzichtspagina's waar snapps gefilterd kunnen worden op locatie en gebruiker

Gebruikers kunnen snapps liken, disliken en favorieten, en foto's uploaden in een snappmap.

Tot slot zijn er een aantal extra functionaliteiten toegevoegd:
- **Geolocatie:** via de Photon API wordt bij het uploaden van een snapp de locatie opgehaald en opgeslagen, zodat snapps gefilterd kunnen worden op locatie.
- **Service worker:** zorgt ervoor dat de website ook zonder internetverbinding werkt; de gebruiker krijgt dan een duidelijke melding in plaats van een browserfout.
- **Cookie parser:** regelt een tijdelijke inlog via cookies, zodat de gebruiker ingelogd blijft tijdens het navigeren.
- **PWA:** de website is installeerbaar als Progressive Web App, waardoor hij als een native app te gebruiken is zonder tussenkomst van de App Store of Google Play.

## Gebruik
<!-- Bij Gebruik staat de user story, hoe het werkt en wat je er mee kan. -->


## Kenmerken
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. Wat is de HTML structuur? Wat zijn de belangrijkste dingen in CSS? Wat is er met JS gedaan en hoe? Misschien heb je iets met NodeJS gedaan, of heb je een framwork of library gebruikt? -->

## Installatie
<!-- Bij Instalatie staat hoe een andere developer aan jouw repo kan werken -->
Volg deze stappen om de development omgeving in te richten om aan deze repository te kunnen werken:

Stap 1) installeer de [NodeJS ontwikkelomgeving](https://nodejs.org/en/download). Kies voor NodeJS 24.13.0 (LTS, long-term support), download het installatiebestand en doorloop het installatieproces.

Stap 2) Fork deze repository, *clone* deze op jouw computer en open het in VSCodium/ een code editor.

Stap 3) Open de Terminal in VSCodium, voer in de terminal het commando `npm install uit` door het in te typen en op enter te drukken.

Stap 4) Om `multipart/form-data` (bestanden) te kunnen POST'en is het handig om [Multer](https://www.npmjs.com/package/multer) te installeren in de terminal. 

Stap 5) Om de `cookie-parser` te kunnen gebruiken, voer in de terminal het commando `npm install cookie-parser` door het in te typen en op enter te drukken. De `cookie-parser` is om een tijdelijke inlog te maken met het gebruik van cookies. 

Stap 6) Na de installatie is de map `node_modules` aangemaakt, en gevuld met allerlei packages. Start de website door in de terminal het comando `npm start` uit te voeren. Als het goed is, komt hier een melding te staan over het opstarten van de server: Application started on http://localhost:8000 — Open deze URL in je browser

## Bronnen
- [Figma ontwerpen van de opdrachtgever](https://www.figma.com/design/0sXvjvqboOmfDuFMUcRHJh/2025snappthisDesign?node-id=0-1&t=FGaH92iMbFUM6n4w-1)
- [Onze gezamenlijke Figma ontwerpen](https://www.figma.com/design/86Zlapr5O8PkjDQn2Xzz5v/SnappThis?node-id=0-1&t=R653Ky9a02iNMUTt-0)
- [FDND Directus database - Snappthis](https://fdnd-agency.directus.app/items/snappthis_snap)
- [Filter rules - @Directus](https://directus.io/docs/guides/connect/filter-rules)
- [Liquid Markup - @Modyo Docs](https://docs.modyo.com/en/platform/channels/liquid-markup.html)
- [Multer | Middleware for uploading files - @NPMJS](https://www.npmjs.com/package/multer)
- [About Photon | Geolocation API - @Github](https://github.com/komoot/photon)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
