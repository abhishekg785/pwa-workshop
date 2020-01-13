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
        console.log('service worker registered', reg);

        const sw = reg.installing || reg.waiting || reg.active;
    });
}
