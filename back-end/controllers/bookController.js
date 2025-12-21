
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
    const response = await axios.get("https://gutendex.com/books");
    const data = response.data;
    console.log("DEFAULT BOOKS FETCHED:");
    const books = (data.results || []).map(mapGutendexBook);

    res.json({ books });
  } catch (err) {
    console.error("DEFAULT BOOKS ERROR:", err.message);
    res.json({ books: [] });
  }
};

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


const saveBook = async (req, res) => {
  try {
    const gutenId = Number(req.params.gutenId);

    if (Number.isNaN(gutenId)) {
      return res.status(400).json({ msg: "Invalid Guten ID" });
    }


    const existing = await prisma.book.findUnique({
      where: { gutenId },
    });

    if (existing) {
      console.log("Book already in DB, returning existing");
      return res.json(existing);
    }


    const metaRes = await axios.get(`https://gutendex.com/books/${gutenId}`);
    const meta = metaRes.data;


    const { url, type } = pickReadableFormat(meta.formats);

    if (!url) {
      console.log("NO READABLE FORMAT FOR GUTEN ID:", gutenId);
      return res.status(400).json({ msg: "Text/HTML version unavailable" });
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
        content
      },
    });

    console.log("Saved book:", savedBook.title, "(", savedBook.gutenId, ")");
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

module.exports = { defaultBooks, searchBooks, saveBook, getBook };
