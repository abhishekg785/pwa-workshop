const version = 7;

const assetsToCache = [
    '/',
    '/main.js',
    '/manifest.json',
    '/icons/icon_512.png',
];

const expectedCaches = [
    `dogs-pwa-static-assets-${version}`,
    'dogs-pwa-data',
    'dogs-pwa-images',
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
    console.log(`sw: fetch: ${event.request.url}`);
    const url = new URL(event.request.url);

    if (url.hostname === 'dog.ceo') {
        event.respondWith(
            handleDogsData(event.request)
        )
    }

    if (url.hostname === 'images.dog.ceo') {
        event.respondWith(
            handleDogImages(event.request)
        )
    }

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
            if (/dogs-pwa/.test(cacheName) && expectedCaches.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
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

// network first
async function handleDogsData(request) {
    try {
        console.log(`sw: handleDogsData: fetching request for ${request.url}`);

        const response = await fetch(request);

        console.log(`sw: handleDogsData: caching dog data`);
        const dogsDataCache = await caches.open('dogs-pwa-data');

        const { message: dogImageData } = await response.clone().json();

        console.log('sw: handleDogsData: deleting not needed dog image cache');
        const dogImagesCache = await caches.open('dogs-pwa-images');
        const dogImageCacheKeys = await dogImagesCache.keys();

        await Promise.all([
            dogImageCacheKeys.filter(imageCacheKey => {
                if (dogImageData.indexOf(imageCacheKey) === -1) {
                    return dogImagesCache.delete(imageCacheKey);
                }
            })
        ]);
        console.log('sw: handleDogsData: not needed dog image cache deletion success');

        await dogsDataCache.put(request, response.clone());
        console.log(`sw: handleDogsData: dog data cached success`);

        return response;
    } catch (err) {
        console.log(`sw: handleDogsData: error while fetching request for ${request.url}`);

        console.log('sw: handleDogsData: getting dog data from cache');
        const response = await caches.match(request);

        if (response) {
            console.log('sw: handleDogsData: found dog data in cache');
            return response;
        } else {
            console.log('sw: handleDogsData: no dog data found in cache');
            return new Response(JSON.stringify({ status: 'no-cache'}), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    }
}

// cache first
async function handleDogImages(request) {
    console.log(`sw: handleDogImages: getting image from cache for ${request.url}`);
    const cacheResponse = await caches.match(request);

    if (cacheResponse) {
        console.log(`sw: handleDogImages: found image in cache for ${request.url}`);
        return cacheResponse;
    }

    console.log(`sw: handleDogImages: no image found in cache for ${request.url}`);
    console.log(`sw: handleDogImages: fetching image for ${request.url}`);
    const response = await fetch(request);
    const dogImagesCache = await caches.open('dogs-pwa-images');
    console.log(`sw: handleDogImages: putting image in cache for ${request.url}`);
    await dogImagesCache.put(request, response.clone());
    console.log(`sw: handleDogImages: image cached success for ${request.url}`);

    return response;
}
