import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Library.css";

import { useBookmarks } from "../../context/BookmarkContext";
import { useFavorites } from "../../context/FavoriteContext";
import { getAllProgress, deleteProgress } from "../../services/progressService";

import BookCard from "../../components/BookCard/BookCard";
import ProgressBookCard from "../../components/ProgressBookCard/ProgressBookCard";
import { FiBookOpen, FiBookmark, FiHeart } from "react-icons/fi";

const TABS = [
  { id: "all", label: "All", icon: FiBookOpen },
  { id: "bookmarks", label: "Bookmarks", icon: FiBookmark },
  { id: "favorites", label: "Favorites", icon: FiHeart },
  { id: "progress", label: "Progress", icon: FiBookOpen },
];

const normalizeBook = (book) => ({
  ...book,
  id: book.id || book.bookId,
});

const filterSafe = (items) => items.filter((item) => item?.book);

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="library-empty">
    <Icon className="empty-icon" />
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

function Library() {
  const [activeTab, setActiveTab] = useState("all");
  const [progressList, setProgressList] = useState([]);
  const location = useLocation();

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

  const safeBookmarks = filterSafe(bookmarks);
  const safeFavorites = filterSafe(favorites);

  const allBooks = [
    ...safeBookmarks.map((b) => normalizeBook(b.book)),
    ...safeFavorites.map((f) => normalizeBook(f.book)),
  ].filter(
    (book, index, arr) =>
      book.id && arr.findIndex((x) => x.id === book.id) === index
  );


  const handleRemove = (bookId, removeType = "all") => {
    if (!bookId) return;

    if (removeType === "bookmarks" || removeType === "all") removeBookmark(bookId);
    if (removeType === "favorites" || removeType === "all") removeFavorite(bookId);
  };

  const getTabCount = (tabId) => {
    const counts = {
      all: allBooks.length,
      bookmarks: safeBookmarks.length,
      favorites: safeFavorites.length,
      progress: progressList.length,
    };
    return counts[tabId];
  };

  const renderTabButtons = () => (
    <div className="library-tabs">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`library-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon />
            {tab.label}
            <span className="count">{getTabCount(tab.id)}</span>
          </button>
        );
      })}
    </div>
  );

  const renderEmptyStates = () => {
    const emptyConfigs = {
      bookmarks: {
        icon: FiBookmark,
        title: "No bookmarks yet",
        message: "Books you bookmark will appear here for easy access",
      },
      favorites: {
        icon: FiHeart,
        title: "No favorites yet",
        message: "Your favorite books will appear here",
      },
      progress: {
        icon: FiBookOpen,
        title: "No active reading",
        message: "Start reading a book and it will appear here",
      },
    };

    const config = emptyConfigs[activeTab];
    if (!config) return null;

    const hasContent = {
      bookmarks: safeBookmarks.length > 0,
      favorites: safeFavorites.length > 0,
      progress: progressList.length > 0,
    };

    if (hasContent[activeTab]) return null;

    return <EmptyState icon={config.icon} title={config.title} message={config.message} />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return progressList.map((progress) => (
          <ProgressBookCard
            key={progress.id}
            progress={progress}
            onRemove={async () => {
              try {
                await deleteProgress(progress.bookId);
                setProgressList(progressList.filter((p) => p.id !== progress.id));
              } catch (err) {
                console.error("Failed to delete progress:", err);
              }
            }}
          />
        ));

      case "all":
        return allBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onRemove={() => handleRemove(book.id, "all")}
          />
        ));

      case "bookmarks":
        return safeBookmarks.map((b) => {
          const book = normalizeBook(b.book);
          return (
            <BookCard
              key={book.id}
              book={book}
              onRemove={() => handleRemove(book.id, "bookmarks")}
            />
          );
        });

      case "favorites":
        return safeFavorites.map((f) => {
          const book = normalizeBook(f.book);
          return (
            <BookCard
              key={book.id}
              book={book}
              onRemove={() => handleRemove(book.id, "favorites")}
            />
          );
        });

      default:
        return null;
    }
  };

  return (
    <div className="library-page container">
      <h1 className="library-title">My Library</h1>
      <p className="library-subtitle">Your personal collection and reading progress</p>

      {renderTabButtons()}
      {renderEmptyStates()}

      <div className="library-grid">{renderTabContent()}</div>
    </div>
  );
}

export default Library;
