import React from "react";
import { Book } from "lucide-react";
import "./EmptyBooks.css";

function EmptyBooks({ onStartWriting }) {
  return (
    <div className="empty-books-card">
      <div className="empty-books-icon">
        <Book size={44} />
      </div>

      <h3>No books yet</h3>

      <p>
        Start writing your first book and share your story with the world!
      </p>

      <button onClick={onStartWriting}>
        + Start Writing
      </button>
    </div>
  );
}

export default EmptyBooks;
