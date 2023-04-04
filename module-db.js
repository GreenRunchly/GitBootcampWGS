require('dotenv').config(); // Load Configuration
const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pooldb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
});

module.exports = pooldb;