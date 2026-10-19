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

  for (const [key, val] of Object.entries(formats)) {
    if (key.startsWith("text/plain") && val && !val.endsWith(".zip")) {
      return { url: val, type: "text" };
    }
  }

  for (const [key, val] of Object.entries(formats)) {
    if (key.startsWith("text/html") && val && !val.endsWith(".zip")) {
      return { url: val, type: "html" };
    }
  }

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

    // 1. Resolve metadata (use req.body if supplied, with fast Gutendex fallback)
    let title = req.body?.title || null;
    let authors = Array.isArray(req.body?.authors)
      ? req.body.authors
      : req.body?.author
      ? [req.body.author]
      : [];
    let coverUrl = req.body?.coverUrl || null;
    let fallbackFormatUrl = null;
    let fallbackType = "text";

    if (!title) {
      try {
        const metaRes = await axios.get(
          `https://gutendex.com/books/${gutenId}/`,
          { timeout: 4000 }
        );
        const meta = metaRes.data;
        title = meta.title || title;
        authors = meta.authors?.map((a) => a.name) || authors;
        coverUrl = meta.formats?.["image/jpeg"] || coverUrl;
        const fmt = pickReadableFormat(meta.formats);
        if (fmt.url) {
          fallbackFormatUrl = fmt.url;
          fallbackType = fmt.type;
        }
      } catch (metaErr) {
        // Gutendex timeout or error - continue with direct Gutenberg download
      }
    }

    // 2. Fetch text content directly from Project Gutenberg CDN
    let content = null;
    const directUrls = [
      `https://www.gutenberg.org/cache/epub/${gutenId}/pg${gutenId}.txt`,
      `https://www.gutenberg.org/files/${gutenId}/${gutenId}-0.txt`,
      fallbackFormatUrl,
    ].filter(Boolean);

    for (const textUrl of directUrls) {
      try {
        const textRes = await axios.get(textUrl, {
          responseType: "text",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/plain,text/html,*/*",
          },
          timeout: 8000,
        });

        if (
          textRes.data &&
          typeof textRes.data === "string" &&
          textRes.data.length > 500
        ) {
          content = textRes.data;
          if (textUrl === fallbackFormatUrl && fallbackType === "html") {
            content = htmlToText(content, {
              wordwrap: 120,
              preserveNewlines: false,
            });
          }
          break;
        }
      } catch (fetchErr) {
        // Try next candidate URL
      }
    }

    if (!content) {
      return res
        .status(400)
        .json({ msg: "Text content currently unavailable for this book" });
    }

    // Fallback title / author extraction if still missing
    if (!title) {
      const titleMatch = content.match(/Title:\s*(.+)/i);
      title = titleMatch ? titleMatch[1].trim() : `Gutenberg Book #${gutenId}`;
    }
    if (authors.length === 0) {
      const authorMatch = content.match(/Author:\s*(.+)/i);
      if (authorMatch) authors = [authorMatch[1].trim()];
    }
    if (!coverUrl) {
      coverUrl = `https://www.gutenberg.org/cache/epub/${gutenId}/pg${gutenId}.cover.medium.jpg`;
    }

    // Strip Gutenberg header and footer
    const startMatch = content.match(/\*\*\* START OF (THE|THIS) PROJECT GUTENBERG[^*]*\*\*\*/i);
    if (startMatch && startMatch.index !== undefined) {
      content = content.substring(startMatch.index + startMatch[0].length);
    }
    const endMatch = content.match(/\*\*\* END OF (THE|THIS) PROJECT GUTENBERG[^*]*\*\*\*/i);
    if (endMatch && endMatch.index !== undefined) {
      content = content.substring(0, endMatch.index);
    }
    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

    const savedBook = await prisma.book.create({
      data: {
        gutenId,
        title,
        authors,
        coverUrl,
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

