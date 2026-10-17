const prisma = require("../config/prisma");
const axios = require("axios");
const { htmlToText } = require("html-to-text");
const { getCache, setCache } = require("../utils/cache");

const path = require("path");
const fs = require("fs");

let genreSnapshots = {};
try {
  const snapshotPath = path.join(__dirname, "../data/genreSnapshots.json");
  if (fs.existsSync(snapshotPath)) {
    genreSnapshots = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
    for (const [key, val] of Object.entries(genreSnapshots)) {
      setCache(key, val, 24 * 60 * 60 * 1000);
    }
  }
} catch (e) {
  console.log("Failed to load genreSnapshots:", e.message);
}

const mapGutendexBook = (b) => ({
  gutenId: b.id,
  title: b.title,
  authors: b.authors?.map((a) => a.name) || [],
  coverUrl: b.formats?.["image/jpeg"] || null,
});

const pickReadableFormat = (formats = {}) => {
  if (!formats) return { url: null, type: null };

  const txt =
    formats["text/plain; charset=utf-8"] ||
    formats["text/plain"];

  if (txt) return { url: txt, type: "text" };

  const html =
    formats["text/html; charset=utf-8"] ||
    formats["text/html"];

  if (html) return { url: html, type: "html" };

  return { url: null, type: null };
};

const defaultBooks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const cacheKey = `default_books_page_${page}`;

    const cachedData = getCache(cacheKey) || (page === 1 ? genreSnapshots[cacheKey] : null);
    if (cachedData) {
      return res.json({ ...cachedData, fromCache: true });
    }

    const response = await axios.get(
      `https://gutendex.com/books/?page=${page}`
    );

    const data = response.data;
    const books = (data.results || []).map(mapGutendexBook);

    const result = {
      books,
      total: Number(data.count) || 0,
      hasNext: Boolean(data.next)
    };

    setCache(cacheKey, result, 30 * 60 * 1000);

    res.json(result);
  } catch (err) {
    console.error("DEFAULT BOOKS ERROR:", err.message);
    const fallback = page === 1 ? genreSnapshots["default_books_page_1"] : null;
    if (fallback) {
      return res.json({ ...fallback, fromCache: true });
    }
    res.json({ books: [], total: 0, hasNext: false });
  }
};

const searchBooks = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const cleanQ = q.trim().toLowerCase();
    const cacheKey = `search_${cleanQ}_page_${page}`;

    const cachedData = getCache(cacheKey) || (page === 1 ? genreSnapshots[cacheKey] : null);
    if (cachedData) {
      return res.json({ ...cachedData, fromCache: true });
    }

    const response = await axios.get(
      `https://gutendex.com/books/?search=${encodeURIComponent(q)}&page=${page}`
    );

    const data = response.data;
    const books = (data.results || []).map(mapGutendexBook);

    const result = {
      books,
      total: Number(data.count) || 0,
      hasNext: Boolean(data.next)
    };

    setCache(cacheKey, result, 15 * 60 * 1000);

    res.json(result);
  } catch (err) {
    console.error("SEARCH BOOKS ERROR:", err.message);
    const fallback = page === 1 ? genreSnapshots[`search_${cleanQ}_page_1`] : null;
    if (fallback) {
      return res.json({ ...fallback, fromCache: true });
    }
    res.json({ books: [], total: 0, hasNext: false });
  }
};

(async function preWarmCache() {
  const PRE_WARM_GENRES = [
    { key: "default_books_page_1", url: "https://gutendex.com/books/?page=1" },
    { key: "search_mystery_page_1", url: "https://gutendex.com/books/?search=mystery&page=1" },
    { key: "search_adventure_page_1", url: "https://gutendex.com/books/?search=adventure&page=1" },
    { key: "search_romance_page_1", url: "https://gutendex.com/books/?search=romance&page=1" },
    { key: "search_philosophy_page_1", url: "https://gutendex.com/books/?search=philosophy&page=1" }
  ];

  for (const genre of PRE_WARM_GENRES) {
    try {
      if (!getCache(genre.key)) {
        const response = await axios.get(genre.url, { timeout: 10000 });
        const data = response.data;
        const books = (data.results || []).map(mapGutendexBook);
        setCache(genre.key, {
          books,
          total: Number(data.count) || 0,
          hasNext: Boolean(data.next)
        }, 24 * 60 * 60 * 1000);
      }
    } catch (err) {
      // Continue next genre gracefully
    }
  }
})();

const saveBook = async (req, res) => {
  try {
    const gutenId = Number(req.params.gutenId);
    if (Number.isNaN(gutenId)) {
      return res.status(400).json({ msg: "Invalid Guten ID" });
    }

    const existing = await prisma.book.findUnique({
      where: { gutenId },
    });

    if (existing) return res.json(existing);

    const metaRes = await axios.get(
      `https://gutendex.com/books/${gutenId}/`
    );
    const meta = metaRes.data;

    const { url, type } = pickReadableFormat(meta.formats);
    if (!url) {
      return res
        .status(400)
        .json({ msg: "Text/HTML version unavailable" });
    }

    const textRes = await axios.get(url, { responseType: "text" });
    let content = textRes.data;

    if (type === "html") {
      content = htmlToText(content, {
        wordwrap: 120,
        preserveNewlines: false,
      });
    }

    const savedBook = await prisma.book.create({
      data: {
        gutenId,
        title: meta.title,
        authors: meta.authors?.map((a) => a.name) || [],
        coverUrl: meta.formats?.["image/jpeg"] || null,
        content,
      },
    });

    res.json(savedBook);
  } catch (err) {
    console.error("SAVE BOOK ERROR:", err.message);
    res.status(500).json({ msg: "Error saving book" });
  }
};

const getBook = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) return res.status(404).json({ msg: "Book not found" });

    res.json(book);
  } catch (err) {
    console.error("GET BOOK ERROR:", err.message);
    res.status(500).json({ msg: "Error loading book" });
  }
};

module.exports = {
  defaultBooks,
  searchBooks,
  saveBook,
  getBook,
};

