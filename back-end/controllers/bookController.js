const prisma = require("../config/prisma");
const axios = require("axios");


exports.searchBooks = async (req, res) => {
  try {
    const q = req.query.q || "";

    const url = `https://gutendex.com/books?search=${encodeURIComponent(q)}`;

    const response = await axios.get(url);
    const data = response.data;

    const results = Array.isArray(data.results) ? data.results : [];

    const books = results.map((b) => ({
      gutenId: b.id,
      title: b.title,
      authors: b.authors?.map((a) => a.name) || [],
      coverUrl: b.formats?.["image/jpeg"] || null
    }));

    res.json({ books });
  } catch (err) {
    console.error("GUTENDEX FETCH ERROR:", err.message);
    res.json({ books: [] });
  }
};

exports.saveBook = async (req, res) => {
  try {
    const gutenId = Number(req.params.gutenId);


    const existing = await prisma.book.findUnique({
      where: { gutenId },
    });

    if (existing) return res.json(existing);

    const metaRes = await axios.get(`https://gutendex.com/books/${gutenId}`);
    const meta = metaRes.data;

    const txtUrl =
      meta.formats?.["text/plain; charset=utf-8"] ||
      meta.formats?.["text/plain"] ||
      null;

    if (!txtUrl)
      console.log(" TEXT VERSION UNAVAILABLE FOR GUTEN ID:", gutenId);
      return res.status(400).json({ msg: "Text version unavailable" });

    const textRes = await axios.get(txtUrl, { responseType: "text" });
    const content = textRes.data;

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
    console.error(" SAVE BOOK ERROR:", err.message);
    res.status(500).json({ msg: "Error saving book" });
  }
};

exports.getBook = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) return res.status(404).json({ msg: "Book not found" });

    res.json(book);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error loading book" });
  }
};
