import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book, onRemove }) {
  const navigate = useNavigate();


  const realId = book.id || book._id || book.bookId || null;

  function openDetails() {
    const targetId = realId || book.gutenId;

    navigate(`/main/book/${targetId}`, {
      state: { book },
    });
  }

  return (
    <div className="book-card" onClick={openDetails}>

      {/* ❌ REMOVE BUTTON (optional) */}
      {onRemove && (
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation(); // 🛑 prevent opening details
            onRemove(realId);
          }}
        >
          ✕
        </button>
      )}

      <img
        src={book.coverUrl}
        alt={book.title}
        className="book-cover"
      />

      <h4 className="book-title">{book.title}</h4>

      {book.authors && (
        <p className="book-author">
          {book.authors.join(", ")}
        </p>
      )}
    </div>
  );
}

export default BookCard;
