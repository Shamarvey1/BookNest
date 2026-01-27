const prisma = require("../config/prisma");
const axios = require("axios");
const { htmlToText } = require("html-to-text");


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

    const response = await axios.get(
      `https://gutendex.com/books?page=${page}`
    );

    const data = response.data;

    const books = (data.results || []).map(mapGutendexBook);

    res.json({
      books,
      hasNext: Boolean(data.next)
    });
  } catch (err) {
    console.error("DEFAULT BOOKS ERROR:", err.message);
    res.json({ books: [], hasNext: false });
  }
};


const searchBooks = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;

    const response = await axios.get(
      `https://gutendex.com/books?search=${encodeURIComponent(q)}&page=${page}`
    );

    const data = response.data;

    const books = (data.results || []).map(mapGutendexBook);

    res.json({
      books,
      hasNext: Boolean(data.next)
    });
  } catch (err) {
    console.error("SEARCH BOOKS ERROR:", err.message);
    res.json({ books: [], hasNext: false });
  }
};


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
      `https://gutendex.com/books/${gutenId}`
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
