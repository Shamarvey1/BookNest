import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { useParams } from "react-router-dom";
import "./ReaderPage.css";
import { getBookByIdAPI } from "../../services/bookService";

const PAGE_SIZE = 1500;

function ReaderPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const loadBook = async () => {
      const data = await getBookByIdAPI(id);
      if (!data || !data.content) return;

      const text = data.content;
      const chunks = [];

      for (let i = 0; i < text.length; i += PAGE_SIZE) {
        chunks.push(text.substring(i, i + PAGE_SIZE));
      }

      setBook(data);
      setPages(chunks);
    };

    loadBook();
  }, [id]);

  if (!book) return <div className="reader-loading">Loading book…</div>;

  return (
    <div className="reader-wrapper">
      <h1 className="reader-title">{book.title}</h1>

      <HTMLFlipBook
        width={500}
        height={700}
        size="fixed"
        minWidth={315}
        maxWidth={600}
        minHeight={400}
        maxHeight={900}
        showCover={true}
        mobileScrollSupport={true}
        className="flip-book"
      >
        <div className="page cover-page">
          <h2>{book.title}</h2>
          <p className="author">{book.authors?.join(", ")}</p>
        </div>

        {pages.map((p, i) => (
          <div key={i} className="page">
            <div className="page-text">{p}</div>
            <div className="page-number">{i + 1}</div>
          </div>
        ))}

        <div className="page end-page">
          <h2>THE END</h2>
        </div>
      </HTMLFlipBook>
    </div>
  );
}

export default ReaderPage;
