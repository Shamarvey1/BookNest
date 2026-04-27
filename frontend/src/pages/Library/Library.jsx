import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Library.css";

import { useBookmarks } from "../../context/BookmarkContext";
import { useFavorites } from "../../context/FavoriteContext";
import { getAllProgress, deleteProgress } from "../../services/progressService";

import BookCard from "../../components/BookCard/BookCard";
import { FiBookOpen, FiBookmark, FiHeart } from "react-icons/fi";

function Library() {
  const [activeTab, setActiveTab] = useState("all");
  const [progressList, setProgressList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getAllProgress();
        setProgressList(data || []);
      } catch (err) {
        console.error("Failed to load progress:", err);
      }
    };
    loadProgress();
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get("tab") || localStorage.getItem("defaultLibraryTab");
      if (tab) {
        setActiveTab(tab);
        localStorage.removeItem("defaultLibraryTab");
      }
    } catch (e) {}
  }, [location.search]);

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

        <button
          className={`library-tab ${activeTab === "progress" ? "active" : ""}`}
          onClick={() => setActiveTab("progress")}
        >
          <FiBookOpen />
          Progress
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
        {activeTab === "progress" && (
          <div className="progress-panel">
            {progressList.length === 0 ? (
              <div className="library-empty">
                <FiBookOpen className="empty-icon" />
                <h3>No active reading</h3>
                <p>Start reading a book and it will appear here</p>
              </div>
            ) : (
              progressList.map((progress) => (
                <div key={progress.id} className="progress-card">
                  <img
                    src={progress.book?.coverUrl}
                    alt={progress.book?.title}
                    className="progress-cover"
                  />
                  <div className="progress-info">
                    <h4>{progress.book?.title}</h4>
                    <p>{Math.round(progress.percent)}% read</p>
                    <div style={{ marginTop: 12 }}>
                      <button
                        className="btn-primary"
                        onClick={() => {
                          navigate(`/reader/${progress.bookId}`);
                        }}
                      >
                        Resume
                      </button>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={async () => {
                          try {
                            await deleteProgress(progress.bookId);
                            setProgressList(
                              progressList.filter((p) => p.id !== progress.id)
                            );
                          } catch (err) {
                            console.error("Failed to delete progress:", err);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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
