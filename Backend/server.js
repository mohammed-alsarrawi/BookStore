const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Connected to the database at:", res.rows[0].now);
  }
});

// Routes
// Get all non-deleted books
app.get('/api/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books WHERE is_deleted = FALSE');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Add a new book
app.post("/api/books", async (req, res) => {
  const { title, author, genre, publication_date, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO books (title, author, genre, publication_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, genre, publication_date, description]
    );
    res.json(result.rows[1]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update a book
app.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publication_date, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE books SET title = $1, author = $2, genre = $3, publication_date = $4, description = $5 WHERE id = $6 RETURNING *",
      [title, author, genre, publication_date, description, id]
    );
    res.json(result.rows[1]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Soft delete a book
app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE books SET is_deleted = TRUE WHERE id = $1', [id]);
        res.json({ message: 'Book soft deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
