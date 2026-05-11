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
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  const currentPageRef = useRef(1);
  const lastSavedPageRef = useRef(1);
  const flipBookRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const isMobile = viewportWidth <= 560;
  const stagePaddingX = isMobile ? 16 : 48;
  const stagePaddingY = isMobile ? 20 : 40;
  const availableWidth = Math.max(280, viewportWidth - stagePaddingX * 2);
  const availableHeight = Math.max(420, viewportHeight - stagePaddingY * 2 - 90);
  const idealPageHeight = isMobile ? 1.42 : 1.36;
  const bookWidth = Math.floor(
    Math.min(
      isMobile ? 340 : 540,
      availableWidth,
      Math.floor(availableHeight / idealPageHeight)
    )
  );
  const bookHeight = Math.floor(Math.min(availableHeight, bookWidth * idealPageHeight));

  if(!book){
    return <BookNestLoader text="Loading your book..." />;
  }

  return (
    <div className="reader-wrapper">
      <h1 className="reader-title">{book.title}</h1>

      <div className="reader-stage">
        <HTMLFlipBook
          ref={flipBookRef}
          width={bookWidth}
          height={bookHeight}
          size="stretch"
          minWidth={280}
          maxWidth={600}
          minHeight={400}
          maxHeight={900}
          showCover={true}
          mobileScrollSupport={false}
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
    </div>
  );
}

export default ReaderPage;
