const cacheVersion = "snappthis-v1";

const AssetsToCache = [
    //statische bestanden
    "/styles.css",
    "/script.js",
    "/login.js",
    "/manifest.json",
    "/assets/logo.png",
    "/assets/snappthis-logo.svg",
    "/fonts/Bariol_Regular.otf",
    //routes
    "/",
    "/login",
    "/groups",
    "/snapps",
    // "/user", bestaat nog niet en veroorzaakt anders errors
    "/offline",
];

// download bestanden voor offline en sneller gebruik
self.addEventListener("install", (event) => {
    //zorgt ervoor dat nieuwe versies van de sw direct gebruikt worden
    self.skipWaiting();
    event.waitUntil(
        //gebruikt de caches api om die te openen en daar alles in op te slaan
        caches.open(cacheVersion).then((cache) => {
            return cache.addAll(AssetsToCache);
        }),
    );
    console.log("service worker installed");
});

// activeert het gebruik van de bestanden door de sw
self.addEventListener("activate", (event) => {
    //nieuwe sw pakt meteen alle open paginas
    self.clients.claim();

    // Wacht tot het opruimen klaar is
    event.waitUntil(
        // haal alle cache namen op
        caches.keys().then((cacheNames) => {
            // start alle deletes tegelijk en wacht tot ze klaar zijn
            return Promise.all(
                // loop door alle namen
                cacheNames.map((cache) => {
                    // als het niet de huidige versie is, verwijder hem
                    if (cache !== cacheVersion) {
                        return caches.delete(cache);
                    }
                }),
            );
        }),
    );

    console.log("activated service worker");
});

//Luister naar elk netwerkverzoek
self.addEventListener("fetch", (event) => {
    //pakt het verzoek en bepaalt wat er mee gedaan wor
    event.respondWith(
        //kijkt of er een al gecachede match is
        caches.match(event.request).then((cachedResponse) => {
            //Start op de achtergrond een verzoek naar het echte internet
            const networkFetch = fetch(event.request).then((networkResponse) => {
                // alleen get verzoeken cachen, post mag niet en zorgt voor errors
                if (event.request.method === "GET" && networkResponse.ok) {
                    // internet geeft antwoord, open de cache
                    return caches.open(cacheVersion).then((cache) => {
                        // sla een kopie op in de cache voor de volgende keer
                        cache.put(event.request, networkResponse.clone());
                        // geef de verse versie terug
                        return networkResponse;
                    });
                }
                // POST en andere methodes gewoon teruggeven zonder te cachen
                return networkResponse;
            });

            // geef direct de cache terug, of wacht op het internet als de cache leeg was
            return cachedResponse || networkFetch.catch(() => {
                if (event.request.mode === "navigate"){
                    return caches.match("offline");
                }

        });
        }),
    );
});
