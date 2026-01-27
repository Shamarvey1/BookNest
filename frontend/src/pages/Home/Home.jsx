import React, { useState, useEffect } from "react";
import "./Home.css";
import {
  searchBooksAPI,
  saveBookAPI,
  getDefaultBooksAPI,
} from "../../services/bookService";
import BookCard from "../../components/BookCard/BookCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import BookCardSkeleton from "../../components/Skeletons/BookCardSkeleton/BookCardSkeleton";
import { useNavigate } from "react-router-dom";

const SKELETON_COUNT = 30;

const Home = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    let ignore = false;

    const loadBooks = async () => {
      setLoading(true);

      try {
        const data = query
          ? await searchBooksAPI(query, page)
          : await getDefaultBooksAPI(page);

        if (!ignore) {
          setBooks(data.books || []);
          setHasNext(Boolean(data.hasNext));
        }
      } catch (err) {
        console.error("Failed to load books", err);
        if (!ignore) {
          setBooks([]);
          setHasNext(false);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadBooks();

    return () => {
      ignore = true; 
    };
  }, [page, query]);


  const handleSearch = () => {
    setPage(1);
  };


  const handleAutoSearch = (text) => {
    setQuery(text);
    setPage(1);
  };


  const handleRead = async (gutenId) => {
    const savedBook = await saveBookAPI(gutenId);
    navigate(`/reader/${savedBook.id}`);
  };

  return (
    <div className="home-container">
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onAutoSearch={handleAutoSearch}
      />

      <div className="books-grid">
        {loading &&
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}

        {!loading && books.length === 0 && (
          <p className="no-results">No books found</p>
        )}

        {!loading &&
          books.map((book) => (
            <BookCard
              key={book.gutenId}
              book={book}
              onRead={() => handleRead(book.gutenId)}
            />
          ))}
      </div>


      <div className="pagination">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={!hasNext || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
