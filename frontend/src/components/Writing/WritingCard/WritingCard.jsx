import React from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import "./WritingCard.css";

function WritingCard({ book, onEdit, onDelete }) {
  const wordCount = book.content
    ? book.content.trim().split(/\s+/).length
    : 0;

  return (
    <div className="writing-card">
      <div className="writing-card-icon">
        <FileText size={28} />
      </div>

      <div className="writing-card-body">
        <h3 className="writing-card-title">
          {book.title || "Untitled Book"}
        </h3>

        <p className="writing-card-meta">
          Fiction · {wordCount} words
        </p>

        <p className="writing-card-preview">
          {book.content?.slice(0, 90) || "Start writing your story..."}
        </p>

        <div className="writing-card-footer">
          <span className="writing-card-date">
            Updated {new Date(book.updatedAt || book.createdAt).toLocaleDateString()}
          </span>

          <div className="writing-card-actions">
            <button
              className="edit-btn"
              onClick={() => onEdit(book.id)}
            >
              <Pencil size={15} />
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(book.id)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WritingCard;
