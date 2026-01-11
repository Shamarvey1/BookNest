import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBooks.css";

import {
  fetchMyBooks,
  deleteBook
} from "../../../services/writingService";

import EmptyBooks from "../../../components/Writing/EmptyBooks/EmptyBooks";
import WritingCard from "../../../components/Writing/WritingCard/WritingCard";
import WritingSkeleton from "../../../components/Writing/WritingSkeleton/WritingSkeleton";

function MyBooks() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await fetchMyBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message || "Failed to load books");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  // ➕ New Book
  function handleNewBook() {
    navigate("/main/write-book");
  }

  // ✏️ Edit Book
  function handleEditBook(id) {
    navigate(`/main/write-book/${id}`);
  }

  // 🗑️ Delete Book
  async function handleDeleteBook(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete book");
    }
  }

  return (
    <div className="my-books-page">
      <div className="my-books-header">
        <div>
          <h1 className="my-books-title">My Books</h1>
          <p className="my-books-subtitle">
            Write and manage your own books
          </p>
        </div>

        <button className="new-book-btn" onClick={handleNewBook}>
          + New Book
        </button>
      </div>

      {loading && <WritingSkeleton />}

      {!loading && error && (
        <p className="error-text">{error}</p>
      )}
      {!loading && !error && books.length === 0 && (
        <EmptyBooks onStartWriting={handleNewBook} />
      )}
      {!loading && !error && books.length > 0 && (
        <div className="my-books-grid">
          {books.map((book) => (
            <WritingCard
              key={book.id}
              book={book}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBooks;
