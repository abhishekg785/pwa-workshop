const version = 1;

self.addEventListener('message', async (event) => {
    console.log('sw: message recieved from main:', event.data);
    console.log('sw: sender id:', event.source.id);

    const clientList = await self.clients.matchAll();
    console.log('sw: clients being controlled by this sw', clientList);

    clientList.forEach(client => {
        client.postMessage('hello from sw');
    });
});
