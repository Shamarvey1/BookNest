import React, { useState } from "react";
import { useBookmarks } from "../../context/BookmarkContext";
import { MdBookmark } from "react-icons/md";
import "./BookmarkButton.css";

function BookmarkButton({ book, getBookId, onStatusChange }) {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [loading, setLoading] = useState(false);
  const [optimistic, setOptimistic] = useState(null);

  const bookId = book.id || book.bookId;
  const isBookmarked = bookmarks.some((b) => b.bookId === bookId);
  const displayState = optimistic !== null ? optimistic : isBookmarked;

  async function handleClick() {
    if (loading) return;
    
    setOptimistic(!isBookmarked);
    setLoading(true);

    try {
      const finalId = bookId || (await getBookId());
      const result = await toggleBookmark(finalId);
      onStatusChange && onStatusChange(result);
      setOptimistic(null);
    } catch (err) {
      setOptimistic(null);
      alert(err?.message || "Bookmark failed");
    }

    setLoading(false);
  }

  return (
    <button className="bd-icon-btn" onClick={handleClick}>
      <MdBookmark
        size={24}
        color={displayState ? "#2563eb" : "#555"}
      />
    </button>
  );
}

export default BookmarkButton;
