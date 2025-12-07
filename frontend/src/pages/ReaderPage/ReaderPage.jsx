
import React, { useEffect, useState } from "react";
import "./ReaderPage.css";
import { useParams } from "react-router-dom";
import { getBookByIdAPI } from "../../services/bookService";

const PAGE_SIZE = 1500; 

const ReaderPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const data = await getBookByIdAPI(id);

        if (!data || !data.content) return;

        const text = data.content;
        const pageList = [];

        for (let i = 0; i < text.length; i += PAGE_SIZE) {
          pageList.push(text.substring(i, i + PAGE_SIZE));
        }

        setBook(data);
        setPages(pageList);
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

  const totalPages = pages.length;
  const pageText = pages[currentPage] || "";

  return (
    <div className="reader-container">

      <h1>{book.title}</h1>
      <p className="author">By: {authors}</p>

      <div className="reader-content">
        {pageText}
      </div>

      <div className="pagination-controls">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ← Previous
        </button>

        <span>
          Page {currentPage + 1} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>

    </div>
  );
};

export default ReaderPage;
