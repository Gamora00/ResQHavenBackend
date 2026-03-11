const mysql = require('mysql2/promise')
require('dotenv').config()


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

if(db.connect){
    console.log("Database connected");
    
}

module.exports = db;