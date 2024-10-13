// db.js
const mysql = require('mysql2/promise');

const connectionConfig = {
    host: '127.0.0.1',        // Replace with your MySQL server host
    user: 'root',             // Replace with your MySQL username
    password: 'adilroot',// Replace with your MySQL password
    database: 'sakila'   // Replace with your database name
};

let connection;

async function connect() {
    if (!connection) {
        try {
            connection = await mysql.createConnection(connectionConfig);
            console.log('connected sql');
        } catch (error) {
            console.log('Error While connect to sql');
        }
    }
    return connection;
}

async function close() {
    if (connection) {
        try {
            await connection.end();
            connection = null;
        } catch (error) {
            console.log("Error while closing sql conn")
        }
    }
}

module.exports = {
    connect,
    close,
};
