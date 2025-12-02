import React, { useState, useEffect } from "react";
import "./Home.css";
import {searchBooksAPI,saveBookAPI,getDefaultBooksAPI} from "../../services/bookService";
import BookCard from "../../components/BookCard/BookCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const loadDefaults = async () => {
      setLoading(true);
      const data = await getDefaultBooksAPI();
      setBooks(data.books || []);
      setLoading(false);
    };
    loadDefaults();
  }, []);


  const handleAutoSearch = async (text) => {
    if (!text.trim()) {
      const data = await getDefaultBooksAPI();
      setBooks(data.books || []);
      return;
    }

    setLoading(true);
    const data = await searchBooksAPI(text);
    setBooks(data.books || []);
    setLoading(false);
  };
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const data = await searchBooksAPI(query);
    setBooks(data.books || []);
    setLoading(false);
  };


  const handleRead = async (gutenId) => {
    const savedBook = await saveBookAPI(gutenId);
    console.log("Saved book:", savedBook);
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
      {loading && <p className="loading-text">Searching...</p>}
      <div className="books-grid">
        {!loading && books.length === 0 && query !== "" && (
          <p className="no-results">No books found</p>
        )}

        {books.map((book) => (
          <BookCard
            key={book.gutenId}
            book={book}
            onRead={() => handleRead(book.gutenId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
