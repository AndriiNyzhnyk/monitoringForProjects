'use strict';

const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
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
    return server;
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});