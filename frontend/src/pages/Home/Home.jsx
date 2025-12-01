import React, { useState, useRef } from "react";
import "./Home.css";
import { searchBooksAPI, saveBookAPI } from "../../services/bookService";
import BookCard from "../../components/BookCard/BookCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleAutoSearch = (value) => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!value.trim()) {
        setBooks([]);
        return;
      }

      setLoading(true);
      const data = await searchBooksAPI(value);
      setBooks(data.books);
      setLoading(false);
    }, 400);
  };

  const handleRead = async (gutenId) => {
    const book = await saveBookAPI(gutenId);
    navigate(`/reader/${book.id}`);
  };

  return (
    <div className="home">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleAutoSearch(e.target.value);
          }}
        />
      </div>
      <div className="books-grid">
        {loading && <p className="loading">Searching...</p>}

        {!loading &&
          books.map((book) => (
            <BookCard key={book.gutenId} book={book} onRead={() => handleRead(book.gutenId)} />
          ))}
      </div>
    </div>
  );
};

export default Home;
