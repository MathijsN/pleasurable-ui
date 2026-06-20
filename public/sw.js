const cacheVersion = "snappthis-v1";

const AssetsToCache = [
    //statische bestanden
    "/styles.css",
    "/script.js",
    "/login.js",
    "/manifest.json",
    "/assets/logo.png",
    "/assets/snappthis-logo.svg",
    "/assets/logo-desktop.png",
    "/fonts/Bariol_Regular.otf",
    //routes
    "/",
    "/login",
    "/groups",
    "/snapps",
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

// statische assets 
const staticExtensions = [".css", ".js", ".json", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp", ".otf", ".ttf", ".woff", ".woff2", ".ico"];

// kijkt of de url op een van die assets eindigt
function isStaticAsset(url) {
    return staticExtensions.some((extensie) => url.endsWith(extensie));
}

// haalt iets van het netwerk en bewaart meteen een kopie in de cache
async function fetchAndCache(request) {
    const response = await fetch(request);
    const cache = await caches.open(cacheVersion);
    cache.put(request, response.clone());
    return response;
}

// NETWORK-FIRST: eerst het netwerk proberen voor verse data, bij offline uit cache
// gebruikt voor dynamische data zoals paginas en api verzoeken
async function networkFirst(request) {
    try {
        return await fetchAndCache(request);
    } catch {
        // netwerk faalt, val terug op de cache of anders de offline-pagina
        return (await caches.match(request)) || caches.match("/offline");
    }
}

// STALE-WHILE-REVALIDATE: snel uit cache en ondertussen op de achtergrond verversen
// gebruikt voor statische assets die zelden veranderen
async function staleWhileRevalidate(request) {
    // geef direct de cache terug, of wacht op het netwerk als de cache leeg was
    return (await caches.match(request)) || fetchAndCache(request);
}

//Luister naar elk netwerkverzoek en kies de juiste strategie
self.addEventListener("fetch", (event) => {
    // alleen GET-verzoeken cachen, de rest doorlaten
    if (event.request.method !== "GET") return;

    // statische assets via stale-while-revalidate, dynamische data via network-first
    if (isStaticAsset(event.request.url)) {
        event.respondWith(staleWhileRevalidate(event.request));
    } else {
        event.respondWith(networkFirst(event.request));
    }
});
