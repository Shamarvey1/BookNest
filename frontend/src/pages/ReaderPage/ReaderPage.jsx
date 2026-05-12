import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { useParams } from "react-router-dom";
import "./ReaderPage.css";
import { getBookByIdAPI } from "../../services/bookService";
import { upsertProgress, getProgress } from "../../services/progressService";
import BookNestLoader from "../../components/Loader/BookNestLoader/BookNestLoader";
import AIChat from "../../components/AIChat/AIChat";

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
  const [currentPageText, setCurrentPageText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const currentPageRef = useRef(1);
  const lastSavedPageRef = useRef(1);
  const flipBookRef = useRef(null);

  const isMobile = viewportWidth <= 768;
  const readerMode = isMobile ? "mobile" : "desktop";
  const PAGE_SIZE = 1100;

  const buildContextFromFlipIndex = (flipIndex) => {
    if (!pages.length) return "";

    const contentIndex = Math.max(0, flipIndex - 1);
    const contextParts = [
      pages[contentIndex - 1],
      pages[contentIndex],
      pages[contentIndex + 1],
    ].filter(Boolean);

    return contextParts.join("\n\n");
  };

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
      setCurrentPageText(buildContextFromFlipIndex(1));

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
                setCurrentPageText(buildContextFromFlipIndex(savedPage));
              } catch (e) {
                console.error("Failed to restore page:", e);
              }
            }, 500);
          }
        } catch (err) {
          console.error("Failed to restore progress:", err);
        }
      };

      restoreProgress();
    }
  }, [book, pages]);

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
    setCurrentPageText(buildContextFromFlipIndex(e.data));
  };

  const stagePaddingX = isMobile ? 16 : 60;

  const stagePaddingY = isMobile ? 20 : 40;

  const availableWidth = viewportWidth - stagePaddingX * 2;

  const availableHeight = viewportHeight - stagePaddingY * 2 - 100;

  const bookWidth = isMobile ? Math.min(320, availableWidth - 20) : Math.min(500, availableWidth / 2.2);

  const bookHeight = isMobile ? Math.min(520, availableHeight) : Math.min(720, availableHeight);

  if (!book) {
    return <BookNestLoader text="Loading your book..." />;
  }

  return (
    <div className="reader-wrapper">
      <h1 className="reader-title">{book.title}</h1>

      <div className="reader-stage">
        <div className="reader-main">
          <HTMLFlipBook
            key={readerMode}
            ref={flipBookRef}
            width={bookWidth}
            height={bookHeight}
            size="stretch"
            minWidth={280}
            maxWidth={520}
            minHeight={420}
            maxHeight={900}
            maxShadowOpacity={0.25}
            showCover={true}
            mobileScrollSupport={true}
            swipeDistance={10}
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

      <button
        className="reader-ai-toggle"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open AI Assistant"
      >
        ✨
      </button>

      {isChatOpen && (
        <div className="reader-ai-overlay" role="dialog" aria-modal="true">
          <button
            className="reader-ai-backdrop"
            onClick={() => setIsChatOpen(false)}
            aria-label="Close AI Assistant"
          />
          <div className="reader-ai-panel">
            <AIChat currentText={currentPageText} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReaderPage;