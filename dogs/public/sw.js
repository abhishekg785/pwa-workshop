const version = 4;

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
