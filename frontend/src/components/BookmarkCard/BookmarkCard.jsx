import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book, onRemove }) {
  const navigate = useNavigate();

  function openDetails() {
    if (!book.id) return;
    navigate(`/main/book/${book.id}`, { state: { book } });
  }

  return (
    <div className="book-card" onClick={openDetails}>
      {onRemove && (
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation(); 
            onRemove(book.id);
          }}
        >
          ✕
        </button>
      )}
      <img src={book.coverUrl} className="book-cover" alt={book.title} />
      <h4 className="book-title">{book.title}</h4>
      {book.authors && (
        <p className="book-author">{book.authors.join(", ")}</p>
      )}
    </div>
  );
}

export default BookCard;
