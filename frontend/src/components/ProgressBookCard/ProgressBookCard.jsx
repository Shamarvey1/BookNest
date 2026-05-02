import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressBookCard.css";

function ProgressBookCard({ progress, onRemove }) {
  const navigate = useNavigate();

  const handleResume = (e) => {
    e.stopPropagation();
    navigate(`/reader/${progress.bookId}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove();
  };

  const book = progress.book || {};

  return (
    <div className="progress-book-card">
      <img
        src={book.coverUrl}
        alt={book.title}
        className="progress-book-cover"
      />

      <h4 className="progress-book-title">{book.title}</h4>

      {book.authors && (
        <p className="progress-book-author">
          {book.authors.join(", ")}
        </p>
      )}

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.round(progress.percent)}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(progress.percent)}%</span>
      </div>

      <div className="reading-dates">
        <span className="date-label">Started</span>
        <span className="date-value">
          {new Date(progress.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="progress-actions">
        <button className="btn-resume" onClick={handleResume}>
          Resume
        </button>
        <button className="btn-remove" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default ProgressBookCard;
