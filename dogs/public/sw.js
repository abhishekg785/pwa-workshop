const version = 2;

self.addEventListener('fetch', (event) => {
    event.respondWith(
        handleRequest(event.request)
    )
});

async function handleRequest(request) {
    try {
        const response = await fetch(request);

        const cache = await caches.open('dogs-pwa');
        await cache.put(request, response.clone());

        return response;
    } catch (err) {
        const response = await caches.match(request);

        return response;
    }
}
