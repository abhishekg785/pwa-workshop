const version = 1;

self.addEventListener('message', async (event) => {
    const senderId = event.source.id;
    console.log('sw: senderid', senderId);

    const clientList = await self.clients.matchAll();
    clientList.forEach(client => {
        console.log('sw: client', client);
        client.postMessage('hello from the sw');
    });
});
