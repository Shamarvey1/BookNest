import React, { useEffect, useState } from "react";
import "./ReaderPage.css";
import { useParams } from "react-router-dom";
import { getBookByIdAPI } from "../../services/bookService";

const ReaderPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

useEffect(() => {
  const loadBook = async () => {
    try {
      const data = await getBookByIdAPI(id);
      if (!data || !data.id || !data.content) {
        return; 
      }

      setBook(data);
    } catch (err) {
      console.error("READER LOAD ERROR:", err);
    }
  };

  loadBook();
}, [id]);


  if (!book) return <div className="reader-loading">Loading book...</div>;

  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.authors;

  return (
    <div className="reader-container">
      <h1>{book.title}</h1>
      <p className="author">By: {authors}</p>

      <div className="reader-content">
        {book.content}
      </div>
    </div>
  );
};

export default ReaderPage;
