import React from "react";
import "./EmptyBooks.css";

function EmptyBooks({ onStartWriting }) {
  return (
    <div className="empty-books">
      <h2>No books yet</h2>
      <p>Start writing your first book today.</p>
      <button onClick={onStartWriting}>Start Writing</button>
    </div>
  );
}

export default EmptyBooks;

