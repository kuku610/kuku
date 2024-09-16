const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// PostgreSQL client setup
const client = new Client({
  password: "root",
  user: "root",
  host: "postgres",
  database: "root", // Ensure this matches your postgres configuration
});

// Connect to the PostgreSQL database
(async () => {
  await client.connect();

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
})();

// Endpoint to save user data to the database
app.post("/users", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  try {
    await client.query("INSERT INTO users (name, password) VALUES ($1, $2)", [
      name,
      password,
    ]);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Endpoint to get all users from the database
app.get("/todo", async (req, res) => {
  // Extract the code from the query parameters
  const { code } = req.query;

  // Check if the code is equal to '123'
  if (code !== '123') {
    return res.status(403).json([]); // Forbidden or empty response
  }

  try {
    // Query the database to retrieve all users
    const results = await client.query("SELECT * FROM users");
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

