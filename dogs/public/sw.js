const version = 1;

self.addEventListener('message', (event) => {
    console.log('sw: message received:', event.data);
});
