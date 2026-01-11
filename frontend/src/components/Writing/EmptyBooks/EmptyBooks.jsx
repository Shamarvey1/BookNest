import React from "react";
import "./EmptyBooks.css";

function EmptyBooks({ onStartWriting }) {
  return (
    <div className="empty-books">
      <div className="empty-box">
        <h2>No books yet</h2>
        <p>Start writing your first book and build your own collection.</p>
        <button onClick={onStartWriting}>Start Writing</button>
      </div>
    </div>
  );
}

export default EmptyBooks;
