const mysql = require('mysql2');
require('dotenv').config()

connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}
)

module.exports = connection;