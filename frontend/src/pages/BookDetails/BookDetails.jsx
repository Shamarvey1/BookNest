import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookDetails.css";

import BookmarkButton from "../../components/BookmarkButton/BookmarkButton";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";

const API_BASE = "http://localhost:5001/api";

function BookDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

  const [toast, setToast] = useState(null);


  if (!book) {
    return (
      <div className="bookdetails-container">
        <p>Book not found.</p>
      </div>
    );
  }


  function getLocalBookId(b) {
    return b.id || b._id || b.bookId || null;
  }

  async function getOrCreateBookId() {
    const existingId = getLocalBookId(book);
    if (existingId) return existingId;

    if (!book.gutenId) {
      console.error(" Cannot save book — no gutenId provided.");
      return null;
    }

    const res = await fetch(`${API_BASE}/books/save/${book.gutenId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const saved = await res.json();
    return saved.id; 
  }

  async function handleStartReading() {
    const realId = await getOrCreateBookId();
    if (!realId) return;

    navigate(`/reader/${realId}`, {
      state: { book },
    });
  }

  function handleBookmarkStatus(result) {
    showToast(
      result.status === "added" ? "Added to bookmarks" : "Removed from bookmarks"
    );
  }

  function handleFavoriteStatus(result) {
    showToast(
      result.status === "added" ? "Added to favorites" : "Removed from favorites"
    );
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="bookdetails-page">
      {toast && (
        <div className="bd-toast">
          <span className="bd-toast-icon">✔</span>
          <span>{toast}</span>
        </div>
      )}

      <div className="bookdetails-header-row">
        <button className="bd-back-button" onClick={() => navigate("/main")}>
          ← Back to Home
        </button>
      </div>

      <div className="bookdetails-main-card">
        <div className="bd-book-left">
          <div className="bd-cover-wrapper">
            <img src={book.coverUrl} alt={book.title} className="bd-cover-image" />
          </div>
        </div>

        <div className="bd-book-right">
          <h1 className="bd-title">{book.title}</h1>

          {book.authors?.length > 0 && (
            <p className="bd-author">by {book.authors.join(", ")}</p>
          )}

          <div className="bd-actions-row">
            <button className="bd-primary-btn" onClick={handleStartReading}>
              Start Reading
            </button>

            <BookmarkButton
              book={book}
              getBookId={getOrCreateBookId}
              onStatusChange={handleBookmarkStatus}
            />

            <FavoriteButton
              book={book}
              getBookId={getOrCreateBookId}
              onStatusChange={handleFavoriteStatus}
            />
          </div>

          {/* Info Box */}
          <div className="bd-ready-card">
            <div className="bd-ready-title">
              <span className="bd-ready-icon">📖</span>
              <span>Ready to Read</span>
            </div>

            <p className="bd-ready-text">
              Click <strong>"Start Reading"</strong> to preview this book.
            </p>

            <div className="bd-tags-row">
              <span className="bd-tag bd-tag-green">Free to read</span>
              <span className="bd-tag bd-tag-blue">Public domain</span>
              <span className="bd-tag bd-tag-purple">Multiple formats</span>
              <span className="bd-tag bd-tag-orange">Download available</span>
            </div>

            {book.gutenId && (
              <p className="bd-archive-id">
                Archive ID: <code>{book.gutenId}</code>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
