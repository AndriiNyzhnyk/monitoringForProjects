'use strict';

const { launch } = require('./src/server');

launch()
    .then( (server) => {
        console.log(`Server up and running at: ${server.info.uri}`);
    })
    .catch((err) => {
        console.error(err);
    });