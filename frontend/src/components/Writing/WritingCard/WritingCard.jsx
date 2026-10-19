import React from "react";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import "./WritingCard.css";

function WritingCard({ book, onEdit, onDelete, onRead }) {
  const preview =
    book.description ||
    book.content?.slice(0, 110) ||
    "No description provided";

  const date = new Date(book.updatedAt || book.createdAt);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const wordCount = book.content
    ? book.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="writing-card">
      <div className="writing-card-actions-stack">
        {onRead && (
          <button 
            className="icon-btn read" 
            title="Read in BookNest Reader" 
            onClick={() => onRead(book.id)}
          >
            <BookOpen size={15} />
          </button>
        )}
        <button 
          className="icon-btn edit" 
          title="Edit Book" 
          onClick={() => onEdit(book.id)}
        >
          <Pencil size={15} />
        </button>
        <button 
          className="icon-btn delete" 
          title="Delete Book" 
          onClick={() => onDelete(book.id)}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="writing-card-cover" onClick={() => onRead ? onRead(book.id) : onEdit(book.id)}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} />
        ) : (
          <div className="cover-placeholder">
            <BookOpen size={24} />
          </div>
        )}
      </div>

      <div className="writing-card-body">
        <div className="writing-card-top-meta">
          <span className="genre-pill">{book.genre || "Fiction"}</span>
          <span className="word-count-stat">{wordCount.toLocaleString()} words</span>
        </div>
        <h3 className="writing-card-title" onClick={() => onEdit(book.id)}>{book.title}</h3>
        <p className="date">Last edited · {formattedDate}</p>
        <p className="preview">{preview}...</p>
      </div>
    </div>
  );
}

export default WritingCard;
