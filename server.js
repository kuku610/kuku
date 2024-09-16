const sqlite3 = require('sqlite3').verbose();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// SQLite database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Initialize the database if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
  }
});

// Endpoint to save user data to the database
app.post("/users", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  const query = "INSERT INTO users (name, password) VALUES (?, ?)";
  db.run(query, [name, password], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create user" });
    }
    res.status(201).json({ message: "User created successfully", id: this.lastID });
  });
});

// Endpoint to get all users from the database
app.get("/todo", (req, res) => {
  const { code } = req.query;

  if (code !== '123') {
    return res.status(403).json([]); // Forbidden or empty response
  }

  const query = "SELECT * FROM users";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve users" });
    }
    res.status(200).json(rows);
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
