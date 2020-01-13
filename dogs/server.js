const express = require('express');
const path = require('path');

const app = express();

const httpPort = process.env.DOGS_HTTP_PORT || '5500';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(httpPort, () => {
    console.log(`dogs server listening on port ${httpPort}`)
});
