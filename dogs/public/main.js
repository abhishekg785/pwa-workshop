;(async function (d, w) {
    const app = d.getElementById('app');
    const updateButton = d.getElementById('update');

    const { message: dogImages } = await fetch('https://dog.ceo/api/breeds/image/random/7').then(d => d.json());

    const html =dogImages.reduce((a, c) => {
        a += `<div class='dog'><img src='${c}' /></div>`;

        return a;
    }, '');

    app.innerHTML = html;

    function updateReady(worker) {
       updateButton.style.display = 'block';

       updateButton.addEventListener('click', () => {
        console.log('main:updateButton click');
        worker.postMessage('skipWaiting');
    });
    }

    function trackInstallingPhase(worker) {
        console.log('main: trackInstallingPhase');

        worker.addEventListener('statechange', () => {
            if (worker.state === 'installed') {
                updateReady(worker);
            }
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('main: service worker registered', reg);

            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.waiting) {
                console.log('main: reg.waiting')
                updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                console.log('main: reg.installing')
                trackInstallingPhase(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', () => {
                console.log('main: updatefound')
                trackInstallingPhase(reg.installing);
            });
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('main: controllerchange');

            window.location.reload();
        });
    }
})(document, window);

