import React from "react";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import "./WritingCard.css";

function WritingCard({ book, onEdit, onDelete }) {
  const preview =
    book.description ||
    book.content?.slice(0, 90) ||
    "No description provided";

  const date = new Date(book.updatedAt || book.createdAt);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="writing-card">
      <div className="writing-card-actions-stack">
        <button className="icon-btn edit" onClick={() => onEdit(book.id)}>
          <Pencil size={16} />
        </button>
        <button className="icon-btn delete" onClick={() => onDelete(book.id)}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="writing-card-cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} />
        ) : (
          <div className="cover-placeholder">
            <BookOpen size={24} />
          </div>
        )}
      </div>

      <div className="writing-card-body">
        <h3>{book.title}</h3>
        <p className="genre">{book.genre || "Fiction"}</p>
        <p className="date">Last updated · {formattedDate}</p>
        <p className="preview">{preview}</p>
      </div>
    </div>
  );
}

export default WritingCard;
