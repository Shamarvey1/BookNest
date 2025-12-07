import React, { useState } from "react";
import "./Library.css";

import { useBookmarks } from "../../context/BookmarkContext";
import { useFavorites } from "../../context/FavoriteContext";

import BookCard from "../../components/BookCard/BookCard";

function Library() {
  const [activeTab, setActiveTab] = useState("all");

  const { bookmarks, removeBookmark } = useBookmarks();
  const { favorites, removeFavorite } = useFavorites();
  const safeBookmarks = bookmarks.filter((b) => b?.book);
  const safeFavorites = favorites.filter((f) => f?.book);

  function normalize(book) {
    return {
      ...book,
      id: book.id || book._id || book.bookId
    };
  }

  const allBooks = [
    ...safeBookmarks.map((b) => normalize(b.book)),
    ...safeFavorites.map((f) => normalize(f.book)),
  ].filter(
    (book, index, arr) =>
      book.id &&
      arr.findIndex((x) => x.id === book.id) === index
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

      <div className="tab-container">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>

        <button
          className={`tab ${activeTab === "bookmarks" ? "active" : ""}`}
          onClick={() => setActiveTab("bookmarks")}
        >
          Bookmarks
        </button>

        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites
        </button>
      </div>

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
