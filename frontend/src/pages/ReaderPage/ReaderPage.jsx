import React, { useEffect, useState } from "react";
import "./ReaderPage.css";
import { useParams } from "react-router-dom";
import { getBookByIdAPI } from "../../services/bookService";

const ReaderPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      const data = await getBookByIdAPI(id);
      setBook(data);
    };

    loadBook();
  }, [id]);

  if (!book) return <div className="reader-loading">Loading book...</div>;

  return (
    <div className="reader-container">
      <h1>{book.title}</h1>
      <p className="author">By: {book.authors.join(", ")}</p>

      <pre className="reader-content">
        {book.content}
      </pre>
    </div>
  );
};

export default ReaderPage;
