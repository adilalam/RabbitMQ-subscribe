// connection.js
const amqp = require('amqplib');

async function createConnection(url) {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    return { connection, channel };
}

module.exports = createConnection;
