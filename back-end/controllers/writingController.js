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
  const { title, content, genre, description, coverUrl } = req.body;

  const updated = await prisma.userBook.update({
    where: { id: req.params.id },
    data: { title, content, genre, description, coverUrl }
  });

  res.json(updated);
};

const deleteBook = async (req, res) => {
  await prisma.userBook.delete({
    where: { id: req.params.id }
  });
  res.json({ msg: "Book deleted" });
};

module.exports = {
  createBook,
  getMyBooks,
  getBookById,
  updateBook,
  deleteBook
};
