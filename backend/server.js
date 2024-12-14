const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',       // Replace with your database host
  user: 'root',    // Replace with your database username
  password: 'kaleb',// Replace with your database password
  database: 'dbitsmarato' // Replace with your database name
});

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

// Example query to fetch data
connection.query('SELECT * FROM user_info', (err, results) => {
  if (err) throw err;
  console.log(results); // Log query results
});

// Close the connection when done
connection.end();
