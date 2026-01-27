import React, { useState, useEffect } from "react";
import "./Home.css";
import {
  searchBooksAPI,
  saveBookAPI,
  getDefaultBooksAPI
} from "../../services/bookService";
import BookCard from "../../components/BookCard/BookCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import BookCardSkeleton from "../../components/Skeletons/BookCardSkeleton/BookCardSkeleton";

const PAGE_SIZE = 32;

const Home = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();


  useEffect(() => {
    loadBooks();
  }, [page]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = query
        ? await searchBooksAPI(query, page, PAGE_SIZE)
        : await getDefaultBooksAPI(page, PAGE_SIZE);

      setBooks(data.books || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSearch = async (text) => {
    setQuery(text);
    setPage(1);

    if (!text.trim()) {
      setLoading(true);
      const data = await getDefaultBooksAPI(1, PAGE_SIZE);
      setBooks(data.books || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await searchBooksAPI(text, 1, PAGE_SIZE);
    setBooks(data.books || []);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setPage(1);
    setLoading(true);
    const data = await searchBooksAPI(query, 1, PAGE_SIZE);
    setBooks(data.books || []);
    setLoading(false);
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
          Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}

        {!loading && books.length === 0 && query && (
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

      {!loading && books.length > 0 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>Page {page}</span>

          <button
            disabled={books.length < PAGE_SIZE}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
