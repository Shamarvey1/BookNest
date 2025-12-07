import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";
import { ENDPOINT } from "../../config/endpoint";

const API_BASE = `${ENDPOINT}/api`;

function BookCard({ book, onRemove }) {
  const navigate = useNavigate();

  const realId = book.id || book._id || book.bookId;

  async function openDetails() {
    let finalId = realId;
    let finalBook = book;

    if (!finalId) {
      console.log("📚 Saving new book into DB...", book);

      const res = await fetch(`${API_BASE}/books/save/${book.gutenId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const saved = await res.json();

      finalId = saved.id;


      finalBook = { ...book, id: saved.id };

      console.log("📘 Book saved successfully — new ID =", finalId);
    }

  
    navigate(`/main/book/${finalId}`, { state: { book: finalBook } });
  }

  return (
    <div className="book-card" onClick={openDetails}>
      {onRemove && (
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(realId);
          }}
        >
          ✕
        </button>
      )}

      <img src={book.coverUrl} alt={book.title} className="book-cover" />

      <h4 className="book-title">{book.title}</h4>

      {book.authors && (
        <p className="book-author">{book.authors.join(", ")}</p>
      )}
    </div>
  );
}

export default BookCard;
