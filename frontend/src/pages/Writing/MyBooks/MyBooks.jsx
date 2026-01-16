import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBooks.css";

import {
  fetchMyBooks,
  deleteBook
} from "../../../services/writingService";

import WritingCard from "../../../components/Writing/WritingCard/WritingCard";
import EmptyBooks from "../../../components/Writing/EmptyBooks/EmptyBooks";
import WritingSkeleton from "../../../components/Writing/WritingSkeleton/WritingSkeleton";

function MyBooks() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch books
  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await fetchMyBooks();
        setBooks(data || []);
      } catch (err) {
        setError(err.message || "Failed to load books");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  // New book
  const handleNewBook = () => {
    navigate("/main/write-book");
  };

  // Edit book
  const handleEditBook = (id) => {
    navigate(`/main/write-book/${id}`);
  };

  // Delete book
  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete book");
    }
  };

  return (
    <div className="my-books-page">
      {/* Header */}
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
        <p className="my-books-error">{error}</p>
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
