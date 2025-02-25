import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    publication_date: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:5000/api/books");
    setBooks(response.data);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update a book
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/books/${editId}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/books", formData);
    }
    fetchBooks();
    setFormData({
      title: "",
      author: "",
      genre: "",
      publication_date: "",
      description: "",
    });
    setEditId(null);
  };

  // Edit a book
  const handleEdit = (book) => {
    setFormData(book);
    setEditId(book.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/books/${id}`);
    fetchBooks(); // Refresh the book list
  };

  return (
    <div>
      <h1>Book Catalog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
        />
        <input
          type="date"
          name="publication_date"
          value={formData.publication_date}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Update" : "Add"} Book</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <p>{book.genre}</p>
            <p>{book.publication_date}</p>
            <p>{book.description}</p>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
