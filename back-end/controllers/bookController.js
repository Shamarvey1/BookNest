// backend/controllers/bookController.js
const prisma = require("../config/prisma");
const axios = require("axios");
const { htmlToText } = require("html-to-text");

// Helper: map Gutendex result → our frontend book card shape
const mapGutendexBook = (b) => ({
  gutenId: b.id,
  title: b.title,
  authors: b.authors?.map((a) => a.name) || [],
  coverUrl: b.formats?.["image/jpeg"] || null,
});

// Helper: pick best readable format URL (txt > html)
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
    const response = await axios.get("https://gutendex.com/books");
    const data = response.data;

    const books = (data.results || []).map(mapGutendexBook);

    res.json({ books });
  } catch (err) {
    console.error("DEFAULT BOOKS ERROR:", err.message);
    res.json({ books: [] });
  }
};

// ------------------ SEARCH BOOKS FROM GUTENDEX ------------------
const searchBooks = async (req, res) => {
  try {
    const q = req.query.q || "";

    const url = `https://gutendex.com/books?search=${encodeURIComponent(q)}`;
    const response = await axios.get(url);
    const data = response.data;

    const results = Array.isArray(data.results) ? data.results : [];
    const books = results.map(mapGutendexBook);

    res.json({ books });
  } catch (err) {
    console.error("GUTENDEX FETCH ERROR:", err.message);
    res.json({ books: [] });
  }
};

// ------------------ SAVE FULL TEXT OF BOOK (TXT OR HTML→TEXT) ------------------
const saveBook = async (req, res) => {
  try {
    const gutenId = Number(req.params.gutenId);

    if (Number.isNaN(gutenId)) {
      return res.status(400).json({ msg: "Invalid Guten ID" });
    }

    // 1️⃣ Check if exists in DB already
    const existing = await prisma.book.findUnique({
      where: { gutenId },
    });

    if (existing) {
      console.log("Book already in DB, returning existing");
      return res.json(existing);
    }

    // 2️⃣ Fetch metadata from Gutendex
    const metaRes = await axios.get(`https://gutendex.com/books/${gutenId}`);
    const meta = metaRes.data;

    // 3️⃣ Pick best format
    const { url, type } = pickReadableFormat(meta.formats);

    if (!url) {
      console.log("NO READABLE FORMAT FOR GUTEN ID:", gutenId);
      return res.status(400).json({ msg: "Text/HTML version unavailable" });
    }

    // 4️⃣ Download content
    const textRes = await axios.get(url, { responseType: "text" });
    let content = textRes.data;

    // 5️⃣ If HTML → convert to plain text
    if (type === "html") {
      content = htmlToText(content, {
        wordwrap: 120,
        preserveNewlines: false,
      });
    }

    // 6️⃣ Save in MongoDB via Prisma
    const savedBook = await prisma.book.create({
      data: {
        gutenId,
        title: meta.title,
        authors: meta.authors?.map((a) => a.name) || [],
        coverUrl: meta.formats?.["image/jpeg"] || null,
        content,
      },
    });

    console.log("Saved book:", savedBook.title, "(", savedBook.gutenId, ")");
    res.json(savedBook);
  } catch (err) {
    console.error("SAVE BOOK ERROR:", err.message);
    res.status(500).json({ msg: "Error saving book" });
  }
};

// ------------------ GET BOOK FROM DATABASE ------------------
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

module.exports = { defaultBooks, searchBooks, saveBook, getBook };
