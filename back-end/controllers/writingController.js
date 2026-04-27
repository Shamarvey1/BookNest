const prisma = require("../config/prisma");

const createBook = async (req, res) => {
  try {
    const { title, content, genre, description, coverUrl } = req.body;

    const book = await prisma.userBook.create({
      data: {
        title,
        content,
        genre,
        description,
        coverUrl,
        userId: req.user.id
      }
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create book" });
  }
};

const getMyBooks = async (req, res) => {
  const books = await prisma.userBook.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: "desc" }
  });
  res.json(books);
};

const getBookById = async (req, res) => {
  const book = await prisma.userBook.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!book) return res.status(404).json({ msg: "Book not found" });
  res.json(book);
};

const updateBook = async (req, res) => {
  try {
    const { title, content, genre, description, coverUrl } = req.body;

    const result = await prisma.userBook.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { title, content, genre, description, coverUrl }
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "Book not found" });
    }

    const updated = await prisma.userBook.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update book" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const result = await prisma.userBook.deleteMany({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.json({ msg: "Book deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete book" });
  }
};

module.exports = {
  createBook,
  getMyBooks,
  getBookById,
  updateBook,
  deleteBook
};
