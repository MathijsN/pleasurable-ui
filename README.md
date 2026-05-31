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

Gebruikers kunnen snapps liken, disliken en favorieten, en fotos/snapps uploaden in een snappmap.

Tot slot zijn er een aantal extra functionaliteiten toegevoegd:
- **Geolocatie:** via de [Photon API](https://github.com/komoot/photon) wordt bij het uploaden van een snapp de locatie [opgehaald](https://github.com/MathijsN/pleasurable-ui/blob/b7df00307c9fa4959b000493fe0c03248f2ba2f3/server.js#L147-L176) en [opgeslagen](https://github.com/MathijsN/pleasurable-ui/blob/b7df00307c9fa4959b000493fe0c03248f2ba2f3/server.js#L187-L194), zodat snapps gefilterd kunnen worden op locatie.
- **Service worker:** zorgt ervoor dat de website ook zonder internetverbinding werkt; de gebruiker krijgt dan een duidelijke melding in plaats van een browserfout.
- **Cookie parser:** regelt een tijdelijke [inlog](https://github.com/MathijsN/pleasurable-ui/blob/b7df00307c9fa4959b000493fe0c03248f2ba2f3/server.js#L82-L90) via cookies, zodat de gebruiker vanuit de loginpagina [geredirect](https://github.com/MathijsN/pleasurable-ui/blob/b7df00307c9fa4959b000493fe0c03248f2ba2f3/server.js#L32-L33) wordt naar de homepagina. 
- **PWA:** de website is installeerbaar als Progressive Web App, waardoor hij als een native app te gebruiken is zonder tussenkomst van de App Store of Google Play.

Link naar website: https://snappthis-main.onrender.com

<img width="200" alt="mobile-black(1)" src="https://github.com/user-attachments/assets/7a5fbadb-5a89-4e66-9d2c-b656052247ef" />

<img width="200" alt="mobile-black(2)" src="https://github.com/user-attachments/assets/f5c9462a-b45b-4c2b-a69f-7dd79ab83b06" />


>_Mockups van active snappmap pagina & snapp detailpagina_

## Gebruik
<!-- Bij Gebruik staat de user story, hoe het werkt en wat je er mee kan. -->
De website/webapplicatie bestaat uit meerdere pagina's en interacties. Als je de app opent, kom je eerst op de [loginpagina](https://github.com/MathijsN/pleasurable-ui/wiki/Login,-Service-Worker-&-Grid-view#login). Hier log je in met het e-mailadres en wachtwoord van 'Anne-fleur Pietersen', waarna er een cookie wordt gezet zodat je ingelogd blijft tijdens het navigeren. De [service worker](https://github.com/MathijsN/pleasurable-ui/wiki/Login,-Service-Worker-&-Grid-view#service-worker-pwa) zorgt er daarnaast voor dat de app ook zonder internetverbinding werkt. Via het manifest is de app bovendien installeerbaar als PWA, Progressive Web App, op je telefoon.

<table>
  <tr>
    <td><img width="200" alt="Image" src="https://github.com/user-attachments/assets/350c8577-0146-49af-b063-d0859fa26108"/></td>
    <td><img width="200" alt="Image" src="https://github.com/user-attachments/assets/a88f217f-1ba6-4c89-9234-503e6a5d125c" /></td>
  </tr>
</table>

Eenmaal ingelogd kom je op een overzicht van de pagina's, waaronder het groepenoverzicht, de snappmappagina en de gebruikerspagina. Hoe je er doorheen navigeert, is te vinden op de wikipagina [Groups page, snappmaps page & user page](https://github.com/MathijsN/pleasurable-ui/wiki/Groups-page,-snappmaps-page-&-user-page).

<table>
  <tr>
    <td><img width="200" alt="Image" src="https://github.com/user-attachments/assets/dc5275e5-c0c7-4b91-8d42-ae3aa8d2c1f7"/></td>
    <td><img width="200" alt="Image" src="https://github.com/user-attachments/assets/e6be5b38-cb79-4bb1-a573-75ce4732517d" /></td>
    <td><img width="200" alt="Image" src="https://github.com/user-attachments/assets/507344dc-ac43-414c-b09d-e6fa9905b93a"/></td>
  </tr>
</table>

In een snappmap kun je de weergave aanpassen via de [grid view wisselaar](https://github.com/MathijsN/pleasurable-ui/wiki/Login,-Service-Worker-&-Grid-view#grid-view-wisselaar). Via een popover in de header kies je tussen vijf weergaves: XLarge, Large, Medium, Small en List.

<table>
  <tr>
    <td><img width="200" alt="Image" src="https://github.com/user-attachments/assets/8621d2ed-1df5-4c66-800f-6bb452336703"/></td>
    <td><img width="200" alt="Image" src="https://github.com/user-attachments/assets/75ca1238-a895-4b2c-bda5-4048d9fa0b05" /></td>
  </tr>
</table>

De twee interacties zijn apart gedocumenteerd. Beide pagina's bevatten de user story, wireflows, breakdown schetsen en technische documentatie per interactie. Het liken, disliken en favorieten van snapps, inclusief de bijbehorende loading en succes states, is uitgewerkt op de pagina [Likes, dislikes & favorites](https://github.com/MathijsN/pleasurable-ui/wiki/Likes,-dislikes-&-favorites-%E2%80%90-Interactie). 

https://github.com/user-attachments/assets/be6a9711-252c-47bc-bd58-ab2a681515a7


Het uploaden van een foto/snapp in een snappmap, inclusief de feedback aan de gebruiker bij een succes of error, is te vinden op de pagina [Upload snapp in snappmap](https://github.com/MathijsN/pleasurable-ui/wiki/Upload-snapp-in-snappmap-%E2%80%90-interactie).

https://github.com/user-attachments/assets/72730276-dcbb-4d3b-a997-d9ad718bb9c0




## Kenmerken
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. Wat is de HTML structuur? Wat zijn de belangrijkste dingen in CSS? Wat is er met JS gedaan en hoe? Misschien heb je iets met NodeJS gedaan, of heb je een framwork of library gebruikt? -->
De website/webapplicatie is gebouwd met NodeJS, Express, Liquid en JSON, en maakt gebruik van de [FDND Directus database - Snappthis](https://fdnd-agency.directus.app/items/snappthis_snap) als databron. Alle pagina's en interacties zijn opgebouwd volgens het principe van Progressive Enhancement: de website is eerst functioneel zonder CSS en JavaScript, en wordt daarna laag voor laag verbeterd met styling, loading states en animaties. Zo is de website/webapplicatie op elk apparaat en in elke browser bruikbaar, en wordt de ervaring steeds gebruiksvriendelijker en fijner naarmate de browser meer ondersteunt.

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
- [Cookie-parser | Middleware for the use of browser cookies - @NPMJS](https://www.npmjs.com/package/cookie-parser)
- [About Photon | Geolocation API - @Github](https://github.com/komoot/photon)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
