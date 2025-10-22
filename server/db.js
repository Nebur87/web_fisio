const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Cambia por tu usuario de MySQL
  password: 'naiara17adrian12', // Cambia por tu contraseña de MySQL
  database: 'reservas_fisio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
