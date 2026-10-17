import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "../BookCard/BookCard";
import BookCardSkeleton from "../Skeletons/BookCardSkeleton/BookCardSkeleton";
import "./BookRow.css";

function BookRow({ title, icon, fetcher, initialBooks = [], onRead }) {
  const rowRef = useRef(null);
  const [books, setBooks] = useState(initialBooks);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(initialBooks.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const fetchingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    if (initialBooks.length > 0) {
      setBooks(initialBooks);
      setLoading(false);
      return;
    }

    async function loadInitial() {
      setLoading(true);
      try {
        const res = await fetcher(1);
        if (isMounted) {
          setBooks(res?.books || []);
          setHasNext(res?.hasNext !== false);
        }
      } catch (err) {
        console.error(`Error loading row "${title}":`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (fetcher) {
      loadInitial();
    }

    return () => {
      isMounted = false;
    };
  }, [fetcher, title]);

  const loadNextPage = async () => {
    if (loading || loadingMore || !hasNext || fetchingRef.current || !fetcher) return;
    fetchingRef.current = true;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const res = await fetcher(nextPage);
      const newBooks = res?.books || [];

      if (newBooks.length === 0) {
        setHasNext(false);
      } else {
        setPage(nextPage);
        setHasNext(res?.hasNext !== false);
        setBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b.gutenId || b.id));
          const uniqueNew = newBooks.filter((b) => !existingIds.has(b.gutenId || b.id));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      console.error(`Failed to auto-load more books for "${title}":`, err);
    } finally {
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  };

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    if (scrollLeft + clientWidth >= scrollWidth - 500) {
      loadNextPage();
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [books, loading, loadingMore]);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;

    if (direction === "right") {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      if (scrollLeft + clientWidth + scrollAmount >= scrollWidth - 600) {
        loadNextPage();
      }
    }

    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="book-row-section">
      <div className="book-row-header">
        <h2 className="book-row-title">
          {icon && <span className="book-row-icon">{icon}</span>}
          <span>{title}</span>
        </h2>
        {books.length > 0 && (
          <span className="book-row-count">{books.length} loaded</span>
        )}
      </div>

      <div className="book-row-wrapper">
        {canScrollLeft && (
          <button
            type="button"
            className="row-nav-btn left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          className="book-row-scroll-container"
          ref={rowRef}
          onScroll={checkScroll}
        >
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="row-card-item">
                <BookCardSkeleton />
              </div>
            ))}

          {!loading &&
            books.map((book) => (
              <div key={book.gutenId || book.id} className="row-card-item">
                <BookCard book={book} onRead={onRead} />
              </div>
            ))}

          {loadingMore &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`more-${i}`} className="row-card-item">
                <BookCardSkeleton />
              </div>
            ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            className="row-nav-btn right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

export default BookRow;

