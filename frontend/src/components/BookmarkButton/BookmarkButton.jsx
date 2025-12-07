import React, { useState } from "react";
import { useBookmarks } from "../../context/BookmarkContext";
import { Bookmark } from "lucide-react";
import "./BookmarkButton.css";

function BookmarkButton({ book, getBookId, onStatusChange }) {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [loading, setLoading] = useState(false);

  const realBookId = book.bookId || book.id || book._id;

  const isBookmarked = bookmarks.some((b) => b.bookId === realBookId);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      const finalId = realBookId || (await getBookId());
      const result = await toggleBookmark(finalId);
      onStatusChange && onStatusChange(result);
    } catch {
      alert("Bookmark failed");
    }

    setLoading(false);
  }

  return (
    <button className="bd-icon-btn" onClick={handleClick}>
      <Bookmark
        size={22}
        strokeWidth={2.4}
        color={isBookmarked ? "#007bff" : "#555"}
        fill={isBookmarked ? "#007bff" : "none"}
      />
    </button>
  );
}

export default BookmarkButton;
