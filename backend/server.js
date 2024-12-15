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

const apiKey = process.env.GPT_SECRET_KEY;

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

app.post('/add-symptoms', async (req, res) => {
  const { dni, mpids, answers, date } = req.body;

  console.log("Answers for insertion:", answers[0]);  // Log the entire request body to debug


  // Check for missing information
  if (!dni || !mpids || !answers || !date) {
    return res.status(400).json({ error: 'Missing information' });
  }

  try {
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err.stack);
        return res.status(500).json({ error: 'Failed to start transaction' });
      }


      // Iterate over the selected MPIDs and insert data for each MPID
      mpids.forEach((mpidValue) => {
        const query = "INSERT INTO mpid_symptoms (dni, mpid, ofeg, tos_persistent, perdua_pes, fatiga, increment_mucositat, congestio_nasal, dolor_gola, febre, dolor_tor, xiulets, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        connection.query(query, [dni, mpidValue, answers[0], answers[1], answers[2], answers[3], answers[4], answers[5], answers[6], answers[7], answers[8], answers[9], date], (err) => {
          if (err) {
            console.error('Error inserting data:', err.stack);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Failed to insert data' });
            });
          }

          if (mpids.indexOf(mpidValue) === mpids.length - 1) {
            connection.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err.stack);
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Failed to commit transaction' });
                });
              }
    
              res.status(200).json({ message: 'User symptoms registered successfully' });
            });
          }
        });
      });
    });
  } catch (err) {
    console.error('Error during transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/dni-usr', async (req, res) => {
  const { email } = req.body;  // Read email from the request body

  if (!email) {
    return res.status(400).json({ error: "Email is not sent" });
  }

  try {
    const query = "SELECT dni FROM user_login WHERE email = ?";
    connection.query(query, [email], async (err, rows) => {
      if (err) {
        console.error("Error gathering dni");
        return res.status(401).json({ error: 'Failed to get dni' });
      }

      const usr = rows[0];
      res.status(200).json({
        dni: usr.dni,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/get-usr-data', async(req, res) => {
  const { email } = req.body;

  if(!email) {
    return res.status(400).json({ error: 'Email is not returned'});
  }

  try {
    const query = "SELECT ui.dni, ui.firstname, ui.lastname, DATE_FORMAT(ui.dob, '%m/%d/%Y') AS formatted_dob, ui.sex, ui.telephone, ul.email FROM user_info ui natural inner join user_login ul where ul.email = ?";
    connection.query(query, [email], async (err, rows) => {
      if(err) {
        console.log("Error fetching user data");
        return res.status(401).json({error: 'Failed to get data'});

      }

      if(rows.length === 0) {
        console.error("No data to fetch");
        return res.status(402).json({error: 'Failed to get data'});
      }

      const usr = rows[0];

      //console.log(usr.formatted_dob);

      res.status(200).json({
        dni: usr.dni,
        firstname: usr.firstname,
        lastname: usr.lastname,
        age: usr.formatted_dob,
        sex: usr.sex,
        email: usr.email,
        number: usr.telephone
      });

    });

  } catch(err) {
    console.error(err);
    res.status(500).json({error: 'Error'});
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
        console.log(user.email);
        return res.status(401).json({ error: 'Invalid email or password' });
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
