import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";
import "./ReaderPage.css";
import { getBookByIdAPI } from "../../services/bookService";
import { upsertProgress, getProgress } from "../../services/progressService";
import BookNestLoader from "../../components/Loader/BookNestLoader/BookNestLoader";
import AIChat from "../../components/AIChat/AIChat";

function sanitizeGutenbergText(rawText) {
  if (!rawText) return "";

  let text = rawText;

  const startMarkers = [
    /\*\*\* START OF THE PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i,
    /\*\*\* START OF THIS PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i,
    /\*END\*THE SMALL PRINT! FOR PUBLIC DOMAIN EBOOKS[^*]*\*/i,
    /START OF THE PROJECT GUTENBERG/i,
  ];

  for (const marker of startMarkers) {
    const match = text.match(marker);
    if (match && match.index !== undefined) {
      text = text.substring(match.index + match[0].length);
      break;
    }
  }

  const endMarkers = [
    /\*\*\* END OF THE PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i,
    /\*\*\* END OF THIS PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i,
    /End of the Project Gutenberg EBook/i,
    /End of Project Gutenberg/i,
  ];

  for (const marker of endMarkers) {
    const match = text.match(marker);
    if (match && match.index !== undefined) {
      text = text.substring(0, match.index);
      break;
    }
  }

  // Fix Gutenberg drop caps like "M [images/i_035_b.png]R." -> "MR."
  text = text.replace(/([A-Za-z])\s*\[images\/[^\]]+\]([A-Za-z])/g, "$1$2");
  // Remove remaining Gutenberg image/illustration/footnote artifacts and curly page tags
  text = text.replace(/\[images\/[^\]]+\]/gi, "");
  text = text.replace(/\[illustration[^\]]*\]/gi, "");
  text = text.replace(/\[footnote[^\]]*\]/gi, "");
  text = text.replace(/\{[0-9]+\}/g, "");

  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

const CHAPTER_REGEX = /^(?:chapter\s+[0-9ivxlcdm]+|book\s+[0-9ivxlcdm]+|act\s+[0-9ivxlcdm]+|stave\s+[0-9ivxlcdm]+|prologue|epilogue)\b/i;

function paginateBookText(cleanText, targetChars = 720) {
  if (!cleanText) return [];

  const rawParagraphs = cleanText.split(/\n\s*\n/);
  const pages = [];
  let currentPage = "";

  for (let para of rawParagraphs) {
    para = para.trim().replace(/[ \t]+/g, " ");
    if (!para) continue;

    const isChapter = CHAPTER_REGEX.test(para.substring(0, 45).trim());

    if (isChapter && currentPage.trim().length > 250) {
      pages.push(currentPage.trim());
      currentPage = "";
    }

    if (currentPage.length + para.length > targetChars) {
      if (currentPage.length >= 500) {
        pages.push(currentPage.trim());
        currentPage = "";
      }
    }

    if (currentPage.length + para.length > targetChars) {
      const sentences = para.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [para];
      for (const sentence of sentences) {
        if (currentPage.length + sentence.length > targetChars && currentPage.length >= 500) {
          pages.push(currentPage.trim());
          currentPage = "";
        }
        currentPage += (currentPage ? " " : "") + sentence.trim();
      }
    } else {
      currentPage += (currentPage ? "\n\n" : "") + para;
    }
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages;
}

function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      const curPage = currentPageRef.current;
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
      resizeTimer = setTimeout(() => {
        try {
          flipBookRef.current?.pageFlip()?.turnToPage(curPage);
        } catch {}
      }, 150);
    };

    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      );
      setIsFullscreen(isFs);
      const curPage = currentPageRef.current;
      setTimeout(() => {
        try {
          flipBookRef.current?.pageFlip()?.turnToPage(curPage);
        } catch {}
      }, 120);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  useEffect(() => {
    const loadBook = async () => {
      const data = await getBookByIdAPI(id);
      if (!data || !data.content) return;

      const cleanText = sanitizeGutenbergText(data.content);
      const targetSize = isMobile ? 520 : 720;
      const paginatedPages = paginateBookText(cleanText, targetSize);

      setBook(data);
      setPages(paginatedPages);
    };

    loadBook();
  }, [id, isMobile]);

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
                flipBookRef.current?.pageFlip()?.turnToPage(savedPage);
                currentPageRef.current = savedPage;
                setActivePageIndex(savedPage);
                lastSavedPageRef.current = savedPage;
                setCurrentPageText(buildContextFromFlipIndex(savedPage));
              } catch (e) {
                console.error("Failed to restore page:", e);
              }
            }, 400);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isChatOpen) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        try {
          flipBookRef.current?.pageFlip()?.flipNext();
        } catch {}
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        try {
          flipBookRef.current?.pageFlip()?.flipPrev();
        } catch {}
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  const handlePageChange = (e) => {
    currentPageRef.current = e.data;
    setActivePageIndex(e.data);
    setCurrentPageText(buildContextFromFlipIndex(e.data));
  };

  const handleFlipNext = () => {
    try {
      flipBookRef.current?.pageFlip()?.flipNext();
    } catch {}
  };

  const handleFlipPrev = () => {
    try {
      flipBookRef.current?.pageFlip()?.flipPrev();
    } catch {}
  };

  const handleScrubberChange = (e) => {
    const targetPage = Number(e.target.value);
    setActivePageIndex(targetPage);
    currentPageRef.current = targetPage;
    try {
      flipBookRef.current?.pageFlip()?.turnToPage(targetPage);
    } catch {}
  };

  const toggleFullscreen = () => {
    const curPage = currentPageRef.current;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(() => {
          try {
            flipBookRef.current?.pageFlip()?.turnToPage(curPage);
          } catch {}
        }, 150);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(() => {
          try {
            flipBookRef.current?.pageFlip()?.turnToPage(curPage);
          } catch {}
        }, 150);
      }).catch(() => {});
    }
  };

  // Dimensions for open two-page book spread:
  const availableStageHeight = Math.max(viewportHeight - 136, 400);
  const availableStageWidth = Math.max(viewportWidth - 140, 320);

  let bookHeight = isMobile ? Math.min(availableStageHeight, 580) : Math.min(availableStageHeight * 0.94, 760);
  let bookWidth = isMobile
    ? Math.min(viewportWidth - 36, 420)
    : Math.floor(bookHeight / 1.4);

  if (!isMobile && bookWidth * 2 > availableStageWidth) {
    bookWidth = Math.floor(availableStageWidth / 2.05);
    bookHeight = Math.floor(bookWidth * 1.4);
  }

  if (!book) {
    return <BookNestLoader text="Loading your book..." />;
  }

  const progressPercent = pages.length > 0 ? Math.round((activePageIndex / pages.length) * 100) : 0;

  return (
    <div className="reader-wrapper">
      <header className="reader-top-bar">
        <div className="top-bar-left">
          <button
            type="button"
            className="btn-exit-reader"
            onClick={() => navigate("/main")}
            aria-label="Back to Discover"
          >
            <ArrowLeft size={18} />
            <span className="btn-exit-label">Library</span>
          </button>
        </div>

        <div className="top-bar-center">
          <h1 className="reader-book-title">{book.title}</h1>
          <span className="reader-book-author">{book.authors?.join(", ")}</span>
        </div>

        <div className="top-bar-right">
          <div className="page-counter-pill">
            <span>Page {activePageIndex} of {pages.length}</span>
            <span className="progress-sub">({progressPercent}%)</span>
          </div>

          <button
            type="button"
            className="btn-reader-action"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </header>

      <div className="reader-stage">
        {!isMobile && (
          <button
            type="button"
            className="book-turn-arrow prev"
            onClick={handleFlipPrev}
            aria-label="Previous Page"
            disabled={activePageIndex <= 1}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div className="reader-main">
          <HTMLFlipBook
            key={book.id}
            ref={flipBookRef}
            startPage={currentPageRef.current || 1}
            width={bookWidth}
            height={bookHeight}
            size="fixed"
            minWidth={280}
            maxWidth={750}
            minHeight={420}
            maxHeight={1000}
            maxShadowOpacity={0.35}
            showCover={true}
            usePortrait={isMobile}
            drawShadow={true}
            flippingTime={700}
            useMouseEvents={true}
            mobileScrollSupport={true}
            swipeDistance={15}
            onFlip={handlePageChange}
            className="flip-book"
          >
            <div className="page cover-page">
              <div className="hardcover-spine-crease" />
              <div className="cover-inner-border">
                {book.coverUrl ? (
                  <div className="cover-art-container">
                    <img src={book.coverUrl} alt={book.title} className="cover-art-img" />
                    <div className="cover-art-shadow" />
                  </div>
                ) : (
                  <div className="cover-fallback-embossed">
                    <BookOpen size={48} className="cover-fallback-icon" />
                    <h2 className="cover-title-embossed">{book.title}</h2>
                    <p className="cover-author-embossed">{book.authors?.join(", ")}</p>
                    <div className="cover-seal">CLASSIC EDITION</div>
                  </div>
                )}
              </div>
            </div>

            {pages.map((pageContent, i) => (
              <div
                key={i}
                className={`page content-page ${i % 2 === 0 ? "left-page" : "right-page"}`}
              >
                <div className="page-inner">
                  <div className="page-header-running-head">
                    <span className="running-title">{book.title}</span>
                  </div>

                  <div className="page-text">
                    {pageContent.split("\n\n").map((paragraph, pIdx) => {
                      const isChapter = CHAPTER_REGEX.test(paragraph.substring(0, 45).trim());
                      if (isChapter) {
                        return (
                          <div key={pIdx} className="chapter-heading-block">
                            <div className="chapter-ornament">✦ ✦ ✦</div>
                            <h3 className="chapter-title">{paragraph}</h3>
                          </div>
                        );
                      }
                      return (
                        <p key={pIdx} className="book-paragraph">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  <div className="page-footer">
                    <span className="page-number">{i + 1}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="page end-page">
              <div className="hardcover-spine-crease reverse" />
              <div className="end-page-content">
                <div className="end-ornament">❦</div>
                <h2 className="end-title">FINIS</h2>
                <p className="end-sub">The End of the Story</p>
                <div className="end-stamp">BookNest Library Edition</div>
              </div>
            </div>
          </HTMLFlipBook>
        </div>

        {!isMobile && (
          <button
            type="button"
            className="book-turn-arrow next"
            onClick={handleFlipNext}
            aria-label="Next Page"
            disabled={activePageIndex >= pages.length}
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      <footer className="reader-bottom-scrubber">
        <button
          type="button"
          className="btn-flip-mini"
          onClick={handleFlipPrev}
          disabled={activePageIndex <= 1}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="scrubber-bar-wrap">
          <input
            type="range"
            min={1}
            max={Math.max(pages.length, 1)}
            value={activePageIndex}
            onChange={handleScrubberChange}
            className="reader-scrubber-slider"
          />
        </div>

        <button
          type="button"
          className="btn-flip-mini"
          onClick={handleFlipNext}
          disabled={activePageIndex >= pages.length}
        >
          <ChevronRight size={16} />
        </button>
      </footer>

      <button
        className="reader-ai-toggle"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open AI Assistant"
      >
        <Sparkles size={20} />
      </button>

      {isChatOpen && (
        <div className="reader-ai-overlay" role="dialog" aria-modal="true">
          <button
            className="reader-ai-backdrop"
            onClick={() => setIsChatOpen(false)}
            aria-label="Close AI Assistant"
          />
          <div className="reader-ai-panel">
            <AIChat
              currentText={currentPageText}
              bookTitle={book.title}
              bookAuthors={book.authors || []}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReaderPage;