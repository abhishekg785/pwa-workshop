;(async function (d, w) {
    const { message: dogImages } = await fetch('https://dog.ceo/api/breeds/image/random/7').then(d => d.json());

    const html =dogImages.reduce((a, c) => {
        a += `<div class='dog'><img src='${c}' /></div>`;

        return a;
    }, '');

    const app = d.getElementById('app');
    app.innerHTML = html;
})(document, window);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('main: service worker registered', reg);

        if (!navigator.serviceWorker.controller) {
            console.log('main: this is a fresh page');

            return;
        }

        if (reg.waiting) {
            updateReady();
            return;
        }

        if (reg.installing) {
            console.log('main: sw is installing');
            trackInstalling(reg.installing);
            return;
        }

        reg.addEventListener('updatefound', () => {
            console.log('main: update found for sw');
            trackInstalling(reg.installing);
        });
    });
}

function updateReady() {
    console.log('main: updateReady');

    // do ux stuff here
}

function trackInstalling(worker) {
    console.log('main: trackInstalling', worker);

    worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
            updateReady();
        }
    });
}
