;(async function (d, w) {
    async function fetchDogData() {
        console.log('[main]: fetching dog data')
        const { message: data } = await fetch('https://dog.ceo/api/breeds/image/random/7').then(d => d.json());

        return data;
    }

    function displayData(data) {
        console.log('main: displaying dog data')
        const html = data.reduce((a, c) => {
            a += `<div class='dog'><img src='${c}' /></div>`;

            return a;
        }, '');

        const app = d.getElementById('app');
        app.innerHTML = html;
    }

    async function main() {
        const data = await fetchDogData();

        displayData(data);
    }

    main();
})(document, window);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('main: service worker registered', reg);

        const sw = reg.installing || reg.waiting || reg.active;

        sw.postMessage('hello from main');
    });

    navigator.serviceWorker.ready.then(reg => {
        console.log('main: service worker is ready');
        const sw = reg.installing || reg.waiting || reg.active;
        sw.postMessage('service worker is ready and working');
    });

    navigator.serviceWorker.addEventListener('controllerchange', (reg) => {
        console.log('main: controller change event', reg);
    });

    if (navigator.serviceWorker.controller) {
        console.log('main: current service worker', navigator.serviceWorker.controller);

        navigator.serviceWorker.controller.postMessage('Hello from main using serviceWorker.controller');
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('main: message received from sw:', event.data);
    });
}
