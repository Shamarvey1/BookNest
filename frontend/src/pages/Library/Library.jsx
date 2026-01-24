import React, { useState } from "react";
import "./Library.css";

import { useBookmarks } from "../../context/BookmarkContext";
import { useFavorites } from "../../context/FavoriteContext";

import BookCard from "../../components/BookCard/BookCard";
import { FiBookOpen, FiBookmark, FiHeart } from "react-icons/fi";

function Library() {
  const [activeTab, setActiveTab] = useState("all");

  const { bookmarks, removeBookmark } = useBookmarks();
  const { favorites, removeFavorite } = useFavorites();

  const safeBookmarks = bookmarks.filter((b) => b?.book);
  const safeFavorites = favorites.filter((f) => f?.book);

  function normalize(book) {
    return {
      ...book,
      id: book.id || book._id || book.bookId,
    };
  }

  const allBooks = [
    ...safeBookmarks.map((b) => normalize(b.book)),
    ...safeFavorites.map((f) => normalize(f.book)),
  ].filter(
    (book, index, arr) =>
      book.id && arr.findIndex((x) => x.id === book.id) === index
  );

  function handleRemoveFromBookmark(bookId) {
    if (!bookId) return;
    removeBookmark(bookId);
  }

  function handleRemoveFromFavorite(bookId) {
    if (!bookId) return;
    removeFavorite(bookId);
  }

  function handleRemoveFromAll(bookId) {
    if (!bookId) return;
    removeBookmark(bookId);
    removeFavorite(bookId);
  }

  return (
    <div className="library-page">
      <h1 className="library-title">My Library</h1>
      <p className="library-subtitle">
        Your personal collection and reading progress
      </p>

      <div className="library-tabs">
        <button
          className={`library-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <FiBookOpen />
          All
          <span className="count">{allBooks.length}</span>
        </button>

        <button
          className={`library-tab ${
            activeTab === "bookmarks" ? "active" : ""
          }`}
          onClick={() => setActiveTab("bookmarks")}
        >
          <FiBookmark />
          Bookmarks
          <span className="count">{safeBookmarks.length}</span>
        </button>

        <button
          className={`library-tab ${
            activeTab === "favorites" ? "active" : ""
          }`}
          onClick={() => setActiveTab("favorites")}
        >
          <FiHeart />
          Favorites
          <span className="count">{safeFavorites.length}</span>
        </button>
      </div>

      {activeTab === "bookmarks" && safeBookmarks.length === 0 && (
        <div className="library-empty">
          <FiBookmark className="empty-icon" />
          <h3>No bookmarks yet</h3>
          <p>Books you bookmark will appear here for easy access</p>
        </div>
      )}

      {activeTab === "favorites" && safeFavorites.length === 0 && (
        <div className="library-empty">
          <FiHeart className="empty-icon" />
          <h3>No favorites yet</h3>
          <p>Your favorite books will appear here</p>
        </div>
      )}


      <div className="library-grid">
        {activeTab === "all" &&
          allBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRemove={() => handleRemoveFromAll(book.id)}
            />
          ))}

        {activeTab === "bookmarks" &&
          safeBookmarks.map((b) => {
            const book = normalize(b.book);
            return (
              <BookCard
                key={book.id}
                book={book}
                onRemove={() => handleRemoveFromBookmark(book.id)}
              />
            );
          })}

        {activeTab === "favorites" &&
          safeFavorites.map((f) => {
            const book = normalize(f.book);
            return (
              <BookCard
                key={book.id}
                book={book}
                onRemove={() => handleRemoveFromFavorite(book.id)}
              />
            );
          })}
      </div>
      
    </div>
  );
}

export default Library;
