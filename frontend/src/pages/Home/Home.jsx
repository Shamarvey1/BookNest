import React, { useState, useEffect } from "react";
import "./Home.css";
import {
  searchBooksAPI,
  saveBookAPI,
  getDefaultBooksAPI
} from "../../services/bookService";
import BookCard from "../../components/BookCard/BookCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import BookCardSkeleton from "../../components/Skeletons/BookCardSkeleton/BookCardSkeleton";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const PAGE_SIZE = 30;

const Home = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);

      const data = query
        ? await searchBooksAPI(query, page)
        : await getDefaultBooksAPI(page);

      setBooks(data.books || []);
      setTotal(data.total || 0);

      setLoading(false);
    }

    loadBooks();
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
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
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

      {total > PAGE_SIZE && (
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <Pagination
            current={page}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
