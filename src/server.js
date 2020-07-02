'use strict';

// Internal Node.js modules
const Path = require('path');


// Hapi.js modules
const Hapi = require('@hapi/hapi');


// Third party dependencies
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') });


// Custom modules
const Amqp = require('./modules/amqp');


// Get process environments
const { HTTP_PORT, HTTP_HOST } = process.env;

const server = Hapi.server({
    port: HTTP_PORT,
    host: HTTP_HOST
});

server.route({
    method: 'GET',
    path: '/',
    handler: function () {

        return 'Hello World !!!';
    }
});

exports.init = async () => {

    await server.initialize();
    return server;
};

exports.launch = async () => {

    await server.start();
    await Amqp.getInstance();
    return server;
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});