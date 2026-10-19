import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Heart } from "lucide-react";
import { useBookmarks } from "../../context/BookmarkContext";
import { useFavorites } from "../../context/FavoriteContext";
import { saveBookAPI } from "../../services/bookService";
import "./BookCard.css";

function BookCard({ book, onRemove, onRead }) {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { favorites, toggleFavorite } = useFavorites();

  const [opening, setOpening] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const isBookmarked = bookmarks.some((b) =>
    (book.id && (b.bookId === book.id || b.book?.id === book.id)) ||
    (book.gutenId && b.book?.gutenId === book.gutenId)
  );

  const isFavorite = favorites.some((f) =>
    (book.id && (f.bookId === book.id || f.book?.id === book.id)) ||
    (book.gutenId && f.book?.gutenId === book.gutenId)
  );

  async function handleOpenReader() {
    if (opening) return;
    setOpening(true);

    try {
      if (onRead) {
        await onRead(book.gutenId || book.id, book);
      } else {
        let realId = book.id || book.bookId;
        if (!realId && book.gutenId) {
          const saved = await saveBookAPI(book.gutenId, {
            title: book.title,
            authors: book.authors,
            coverUrl: book.coverUrl,
          });
          realId = saved.id;
        }
        if (realId) {
          navigate(`/reader/${realId}`, { state: { book } });
        }
      }
    } catch (err) {
      console.error("Failed to open reader:", err);
      alert("Failed to open book reader. Please try again.");
    } finally {
      setOpening(false);
    }
  }

  async function handleBookmarkClick(e) {
    e.stopPropagation();
    if (bookmarkLoading) return;
    setBookmarkLoading(true);

    try {
      let realId = book.id || book.bookId;
      const existing = bookmarks.find((b) =>
        (realId && (b.bookId === realId || b.book?.id === realId)) ||
        (book.gutenId && b.book?.gutenId === book.gutenId)
      );

      if (existing) {
        await toggleBookmark(existing.bookId || existing.book?.id);
      } else {
        if (!realId && book.gutenId) {
          const saved = await saveBookAPI(book.gutenId);
          realId = saved.id;
        }
        if (realId) {
          await toggleBookmark(realId);
        }
      }
    } catch (err) {
      alert(err?.message || "Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  }

  async function handleFavoriteClick(e) {
    e.stopPropagation();
    if (favoriteLoading) return;
    setFavoriteLoading(true);

    try {
      let realId = book.id || book.bookId;
      const existing = favorites.find((f) =>
        (realId && (f.bookId === realId || f.book?.id === realId)) ||
        (book.gutenId && f.book?.gutenId === book.gutenId)
      );

      if (existing) {
        await toggleFavorite(existing.bookId || existing.book?.id);
      } else {
        if (!realId && book.gutenId) {
          const saved = await saveBookAPI(book.gutenId);
          realId = saved.id;
        }
        if (realId) {
          await toggleFavorite(realId);
        }
      }
    } catch (err) {
      alert(err?.message || "Failed to update favorite");
    } finally {
      setFavoriteLoading(false);
    }
  }

  return (
    <div className="book-card" onClick={handleOpenReader} title="Click to read">
      <div className="book-cover-container">
        <img
          src={book.coverUrl || "/placeholder.jpg"}
          alt={book.title}
          className="book-cover"
        />

        <div className="card-top-actions">
          <button
            type="button"
            className={`card-action-btn bookmark-btn ${isBookmarked ? "active" : ""}`}
            onClick={handleBookmarkClick}
            title={isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
            disabled={bookmarkLoading}
          >
            <Bookmark
              size={21}
              strokeWidth={2.2}
              fill={isBookmarked ? "#4f46e5" : "none"}
              color={isBookmarked ? "#4f46e5" : "#ffffff"}
            />
          </button>

          <button
            type="button"
            className={`card-action-btn favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={favoriteLoading}
          >
            <Heart
              size={21}
              strokeWidth={2.2}
              fill={isFavorite ? "#dc2626" : "none"}
              color={isFavorite ? "#dc2626" : "#ffffff"}
            />
          </button>

          {onRemove && (
            <button
              type="button"
              className="card-action-btn remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(book.id || book.gutenId);
              }}
              title="Remove"
            >
              ✕
            </button>
          )}
        </div>

        {opening && (
          <div className="card-opening-overlay">
            <div className="card-spinner" />
            <span>Opening...</span>
          </div>
        )}
      </div>

      <h4 className="book-title" title={book.title}>{book.title}</h4>

      <p className="book-author">
        {book.authors && (Array.isArray(book.authors) ? book.authors.length > 0 : Boolean(book.authors))
          ? Array.isArray(book.authors)
            ? book.authors.join(", ")
            : book.authors
          : "\u00A0"}
      </p>
    </div>
  );
}

export default BookCard;

