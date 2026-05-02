import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book, onRemove }) {
  const navigate = useNavigate();


  function openDetails() {
    const bookId = book.id || book.gutenId;
    if (!bookId) return;

    navigate(`/main/book/${bookId}`, {
      state: { book },
    });
  }

  return (
    <div className="book-card" onClick={openDetails}>

      {onRemove && (
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation(); 
            onRemove(book.id || book.gutenId);
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
