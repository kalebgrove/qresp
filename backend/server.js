const mysql = require('mysql2');
const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_CONNECTION,       // Replace with your database host
  user: process.env.DB_USER,             // Replace with your database username
  password: process.env.DB_PASSWORD,     // Replace with your database password
  database: process.env.DB_NAME          // Replace with your database name
});

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});


app.use(cors({
  origin: 'http://localhost:3001', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Include credentials (if needed)
}));

app.post('/get-usr-data', async(req, res) => {
  const { email } = req.body;

  if(!email) {
    return res.status(400).json({ error: 'Email is not returned'});
  }
})

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Fetch user details from the database
    const query = "SELECT * FROM user_login WHERE email = ?";
    connection.query(query, [email], async (err, rows) => {
      if (err) {
        console.error('Error fetching user:', err.stack);
        return res.status(500).json({ error: 'Failed to log in' });
      }

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = rows[0];
      //console.log(user.password)

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
        console.log(user.email);
      }

      // If login is successful, respond with user details (excluding sensitive info)
      res.status(200).json({ message: 'Login successful', user: { dni: user.dni, email: user.email } });
    });
  } catch (err) {
    console.error('Error during login:', err.stack);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { dni, firstname, lastname, age, tel, sex, email, password } = req.body;

  // Validate the received data
  if (!dni || !firstname || !lastname || !age || !sex || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err.stack);
        return res.status(500).json({ error: 'Failed to register user' });
      }

      const userInfoQuery = "INSERT INTO user_info (dni, firstname, lastname, dob, telephone, sex) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(userInfoQuery, [dni, firstname, lastname, age, tel, sex], (err) => {
        if (err) {
          console.error('Error inserting user info:', err.stack);
          return connection.rollback(() => {
            res.status(500).json({ error: 'Failed to register user' });
          });
        }

        const userLoginQuery = "INSERT INTO user_login (dni, email, password) VALUES (?, ?, ?)";
        connection.query(userLoginQuery, [dni, email, hashedPassword], (err) => {
          if (err) {
            console.error('Error inserting user login:', err.stack);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Failed to register user' });
            });
          }

          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err.stack);
              return connection.rollback(() => {
                res.status(500).json({ error: 'Failed to register user' });
              });
            }

            res.status(200).json({ message: 'User registered successfully' });
          });
        });
      });
    });
  } catch (err) {
    console.error('Error hashing password:', err.stack);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
