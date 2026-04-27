import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { useParams } from "react-router-dom";
import "./ReaderPage.css";
import { getBookByIdAPI } from "../../services/bookService";
import { upsertProgress, getProgress } from "../../services/progressService";
import BookNestLoader from "../../components/Loader/BookNestLoader/BookNestLoader";

const PAGE_SIZE = 1500;

function ReaderPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pages, setPages] = useState([]);
  const currentPageRef = useRef(1);
  const lastSavedPageRef = useRef(1);
  const flipBookRef = useRef(null);

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


  useEffect(() => {
    if (book && pages.length > 0 && flipBookRef.current) {
      const restoreProgress = async () => {
        try {
          const progress = await getProgress(book.id);
          if (progress && progress.position) {
            setTimeout(() => {
              const savedPage = Math.min(Math.max(progress.position, 1), pages.length);
              try {
                flipBookRef.current.pageFlip().turnToPage(savedPage);
                currentPageRef.current = savedPage;
                lastSavedPageRef.current = savedPage;
              } catch (e) {
                console.error("Failed to turn to page:", e);
              }
            }, 500);
          }
        } catch (err) {
          console.error("Failed to restore progress:", err);
        }
      };
      restoreProgress();
    }
  }, [book, pages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (book && currentPageRef.current !== lastSavedPageRef.current) {
        const percent = Math.round((currentPageRef.current / pages.length) * 100);
        upsertProgress(book.id, percent, currentPageRef.current).catch((err) => {
          console.error("Progress save failed:", err);
        });
        lastSavedPageRef.current = currentPageRef.current;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [book, pages.length]);

  useEffect(() => {
    const handleUnload = () => {
      if (book && currentPageRef.current !== lastSavedPageRef.current) {
        const percent = Math.round((currentPageRef.current / pages.length) * 100);
        upsertProgress(book.id, percent, currentPageRef.current).catch(() => {});
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [book, pages.length]);

  const handlePageChange = (e) => {
    currentPageRef.current = e.data;
  };

  if(!book){
    return <BookNestLoader text="Loading your book..." />;
  }

  return (
    <div className="reader-wrapper">
      <h1 className="reader-title">{book.title}</h1>

      <HTMLFlipBook
        ref={flipBookRef}
        width={500}
        height={700}
        size="fixed"
        minWidth={315}
        maxWidth={600}
        minHeight={400}
        maxHeight={900}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={handlePageChange}
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
