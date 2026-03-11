const mysql = require('mysql2/promise')
require('dotenv').config()


const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
})

if(db.connect){
    console.log("Database connected");
    
}

module.exports = db;