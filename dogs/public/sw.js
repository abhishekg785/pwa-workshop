const version = 2;

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    event.respondWith(
        fetch(event.request)
        .catch(err => {
            console.log('sw: error occurred while fetch', event.request.url);

            return new Response('<b>You seem to be offline</b>', {
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        })
    )
});

self.addEventListener('message', (event) => {
    console.log('sw: received message', event.data);

    if (event.data === 'skipWaiting') {
        console.log('sw: skipWaiting')
        event.waitUntil(
            self.skipWaiting()
        )
    }
});
