import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";
import { ENDPOINT } from "../../constants";
const API_BASE = `${ENDPOINT}/api`;

function BookCard({ book, onRemove }) {
  const navigate = useNavigate();

  const realId = book.id || book._id || book.bookId;

  async function openDetails() {
    let finalId = realId;

    if (!finalId) {
      console.log(" Book has no ID — saving to DB now...", book);

      const res = await fetch(`${API_BASE}/books/save/${book.gutenId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const saved = await res.json();
      finalId = saved.id;
      console.log("📘 Book saved, DB ID =", finalId);
    }

    navigate(`/main/book/${finalId}`, { state: { book } });
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

      <img src={book.coverUrl} className="book-cover" />

      <h4 className="book-title">{book.title}</h4>

      {book.authors && (
        <p className="book-author">{book.authors.join(", ")}</p>
      )}
    </div>
  );
}

export default BookCard;
