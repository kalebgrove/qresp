import mysql from 'mysql2';
import dotenv from 'dotenv';
import express from 'express';

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_CONNECTION,       // Replace with your database host
  user: process.env.DB_USER,    // Replace with your database username
  password: process.env.DB_PASSWORD,// Replace with your database password
  database: process.env.DB_NAME // Replace with your database name
});


// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

app.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Validate the received data
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Further validation (e.g., check email format, password strength, etc.)

  // Insert user into the database
  const query = 'INSERT INTO user_info (email, password) VALUES (?, ?)';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err.stack);
      return res.status(500).json({ error: 'Failed to register user' });
    }

    res.status(200).json({ message: 'User registered successfully', userId: results.insertId });
  });
});


// Close the connection when done
connection.end();
