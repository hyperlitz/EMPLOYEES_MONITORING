const mysql = require('mysql2'); 


localhost ='localhost';
user = 'root';
password = 'Hyper1271$';
db = 'employee_monitoring_db';

const pool = mysql.createPool({
  host: localhost,
  user: user,
  password: password,
  database: db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();