const version = 4;

const assetsToCache = [
    '/',
    '/main.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        precache()
    )
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        cleanCache()
    )
});

self.addEventListener('fetch', (event) => {
    console.log(`sw: fetch: ${event.request.url}`, event.request);
    const url = new URL(event.request.url);

    if ((url.hostname === location.hostname) && event.request.method === 'GET') {
        event.respondWith(
            handleSameOriginRequest(event.request)
        )
    }
});

async function precache() {
    console.log('sw: precache: caching static assets');

    const cache = await caches.open(`dogs-pwa-static-assets-${version}`);
    await cache.addAll(assetsToCache);
    console.log('sw: precache: static assets  cached');
}

async function cleanCache() {
    console.log('sw: cleanCache: cleaning unused cache');
    const cacheKeys = await caches.keys();

    await Promise.all(
        cacheKeys.filter(cacheName => {
            if (/dogs-pwa/.test(cacheName)) {
                if (cacheName !== `dogs-pwa-static-assets-${version}`) {
                    return caches.delete(cacheName);
                }
            }
        })
    )
    console.log('sw: cleanCache: unused cache removed');
}

// cache only
async function handleSameOriginRequest(request) {
    const requestUrl = request.url;
    console.log(`sw: handleSameOriginRequest: getting data from cache for ${requestUrl}`);
    const response = await caches.match(request);

    if (response) {
        console.log(`sw: handleSameOriginRequest: found data from cache for ${requestUrl}`);

        return response;
    } else {
        console.log(`sw: handleSameOriginRequest: no data found from cache for ${requestUrl}`);
        return new Response('no-match');
    }
}
