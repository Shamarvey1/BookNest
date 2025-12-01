import React from "react";
import "./BookCard.css";

const BookCard = ({ book, onRead }) => {
  return (
    <div className="book-card">
      <img
        src={book.coverUrl || "/placeholder-cover.png"}
        alt={book.title}
      />

      <h3>{book.title}</h3>
      <p className="author">{book.authors.join(", ")}</p>

      <button onClick={onRead}>Read</button>
    </div>
  );
};

export default BookCard;
