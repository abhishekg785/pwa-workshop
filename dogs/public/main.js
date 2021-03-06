;(async function (d, w) {
    const app = d.getElementById('app');

    const { message: dogImages } = await fetch('https://dog.ceo/api/breeds/image/random/7').then(d => d.json());

    if (dogImages) {
        const html =dogImages.reduce((a, c) => {
            a += `<div class='dog'><img src='${c}' /></div>`;

            return a;
        }, '');

        app.innerHTML = html;
    } else {
        app.innerHTML = 'no data found!';
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('main: service worker registered', reg);
        });
    }
})(document, window);

