'use strict';

const Amqplib = require('amqplib');
const Monitoring = require('../monitoring');

// Get process environments
const { AMQP_URL } = process.env;

class AMQP {
    static async getInstance() {
        if (typeof AMQP.instance === 'undefined') {
            const data = await AMQP._initializeConnection();
            return new AMQP(data);
        }

        return AMQP.instance;
    }

    static async _initializeConnection() {
        const targetQueue = 'monitoring';

        const connection = await Amqplib.connect(AMQP_URL);
        const channel = await connection.createChannel();
        const queue = await channel.assertQueue(targetQueue);

        console.log('Connection to AMQP server was successful');
        return { connection, channel, queue, targetQueue };
    }

    constructor({ connection, channel, queue, targetQueue }) {
        if (typeof AMQP.instance !== 'undefined') {
            return AMQP.instance;
        }

        this.connection = connection;
        this.channel = channel;
        this.queue = queue;
        this.targetQueue = targetQueue;

        channel.consume(targetQueue, (msg) => {
            if (msg !== null) {
                Monitoring.handleNewMessage(msg.content.toString());
                channel.ack(msg);
            }
        });

        AMQP.instance = this;
        return this;
    }
}

module.exports = AMQP;