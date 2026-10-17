import React, { useState, useEffect } from "react";
import "./Home.css";
import {
  searchBooksAPI,
  saveBookAPI,
  getDefaultBooksAPI,
} from "../../services/bookService";
import BookCard from "../../components/BookCard/BookCard";
import BookRow from "../../components/BookRow/BookRow";
import BookCardSkeleton from "../../components/Skeletons/BookCardSkeleton/BookCardSkeleton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { Flame, Compass, Rocket, Heart, BookOpen, X } from "lucide-react";

const PAGE_SIZE = 30;

const ROW_CATEGORIES = [
  {
    id: "trending",
    title: "Trending Now",
    icon: <Flame size={22} className="genre-icon genre-flame" />,
    fetcher: (page) => getDefaultBooksAPI(page),
  },
  {
    id: "mystery",
    title: "Mystery & Detective",
    icon: <Compass size={22} className="genre-icon genre-compass" />,
    fetcher: (page) => searchBooksAPI("mystery", page),
  },
  {
    id: "adventure",
    title: "Adventure & Sci-Fi",
    icon: <Rocket size={22} className="genre-icon genre-rocket" />,
    fetcher: (page) => searchBooksAPI("adventure", page),
  },
  {
    id: "romance",
    title: "Timeless Romance",
    icon: <Heart size={22} className="genre-icon genre-heart" />,
    fetcher: (page) => searchBooksAPI("romance", page),
  },
  {
    id: "philosophy",
    title: "Philosophy & Great Minds",
    icon: <BookOpen size={22} className="genre-icon genre-book" />,
    fetcher: (page) => searchBooksAPI("philosophy", page),
  },
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setSearchPage(1);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setSearchTotal(0);
      return;
    }

    let isMounted = true;

    async function executeSearch() {
      setSearchLoading(true);
      try {
        const res = await searchBooksAPI(query, searchPage);
        if (isMounted) {
          setSearchResults(res?.books || []);
          setSearchTotal(res?.total || 0);
        }
      } catch (err) {
        console.error("Search failed:", err);
        if (isMounted) {
          setSearchResults([]);
          setSearchTotal(0);
        }
      } finally {
        if (isMounted) setSearchLoading(false);
      }
    }

    executeSearch();

    return () => {
      isMounted = false;
    };
  }, [query, searchPage]);

  const handleClearSearch = () => {
    searchParams.delete("q");
    setSearchParams(searchParams);
  };

  const handleRead = async (gutenId) => {
    const savedBook = await saveBookAPI(gutenId);
    navigate(`/reader/${savedBook.id}`);
  };

  const isSearching = Boolean(query && query.trim().length > 0);

  return (
    <div className="home-container">

      {!isSearching && (
        <div className="discover-rows-container">
          {ROW_CATEGORIES.map((cat) => (
            <BookRow
              key={cat.id}
              title={cat.title}
              icon={cat.icon}
              fetcher={cat.fetcher}
              onRead={handleRead}
            />
          ))}
        </div>
      )}

      {isSearching && (
        <div className="search-results-section">
          <div className="search-results-header">
            <div className="search-title-wrap">
              <h3>
                Results for &ldquo;<span>{query}</span>&rdquo;
              </h3>
              {searchTotal > 0 && (
                <span className="search-count-badge">{searchTotal} books found</span>
              )}
            </div>

            <button
              type="button"
              className="clear-search-link"
              onClick={handleClearSearch}
            >
              <X size={16} />
              <span>Clear search</span>
            </button>
          </div>

          <div className="books-grid">
            {searchLoading &&
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}

            {!searchLoading && searchResults.length === 0 && (
              <div className="no-results-box">
                <p className="no-results">No books found for &ldquo;{query}&rdquo;</p>
                <button
                  type="button"
                  className="btn-back-discover"
                  onClick={handleClearSearch}
                >
                  Back to Discover
                </button>
              </div>
            )}

            {!searchLoading &&
              searchResults.map((book) => (
                <BookCard
                  key={book.gutenId || book.id}
                  book={book}
                  onRead={handleRead}
                />
              ))}
          </div>

          {searchTotal > PAGE_SIZE && (
            <div className="home-pagination-wrap">
              <Pagination
                className="home-pagination"
                current={searchPage}
                total={searchTotal}
                pageSize={PAGE_SIZE}
                onChange={(p) => setSearchPage(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

