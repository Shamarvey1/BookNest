import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchBookmarks,
  addBookmark as apiAddBookmark,
  removeBookmark as apiRemoveBookmark,
} from "../services/bookmarkService";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await fetchBookmarks();
      setBookmarks(data);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    }
  }


  async function removeBookmark(bookId) {
    try {
      await apiRemoveBookmark(bookId);
      setBookmarks((prev) =>
        prev.filter(
          (b) =>
            b.bookId !== bookId &&
            b.book?.id !== bookId &&
            b.book?._id !== bookId
        )
      );
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  }

  async function toggleBookmark(bookId) {
    const exists = bookmarks.some((b) => b.bookId === bookId);

    if (exists) {
      await removeBookmark(bookId);
      return { status: "removed" };
    } else {
      try {
        const res = await apiAddBookmark(bookId);
        if (!res.book) {
          await load();
        } else {
          setBookmarks((prev) => [...prev, res]);
        }
        return { status: "added" };
      } catch (err) {
        console.error("Failed to add bookmark:", err);
        throw err;
      }
    }
  }

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, toggleBookmark, removeBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
