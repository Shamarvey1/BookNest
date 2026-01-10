const prisma = require("../config/prisma");

/**
 * @desc    Create a new user-written book
 * @route   POST /api/writing
 * @access  Private
 */
const createBook = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ msg: "Title and content are required" });
    }

    const book = await prisma.userBook.create({
      data: {
        title,
        content,
        userId: req.user.id
      }
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);
    res.status(500).json({ msg: "Failed to create book" });
  }
};

/**
 * @desc    Get all books written by logged-in user
 * @route   GET /api/writing
 * @access  Private
 */
const getMyBooks = async (req, res) => {
  try {
    const books = await prisma.userBook.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ msg: "Failed to fetch books" });
  }
};

/**
 * @desc    Get a single user-written book
 * @route   GET /api/writing/:id
 * @access  Private
 */
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.userBook.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("GET BOOK ERROR:", error);
    res.status(500).json({ msg: "Failed to fetch book" });
  }
};

/**
 * @desc    Update an existing user-written book
 * @route   PUT /api/writing/:id
 * @access  Private
 */
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const existingBook = await prisma.userBook.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingBook) {
      return res.status(404).json({ msg: "Book not found" });
    }

    const updatedBook = await prisma.userBook.update({
      where: { id },
      data: {
        title: title ?? existingBook.title,
        content: content ?? existingBook.content
      }
    });

    res.json(updatedBook);
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);
    res.status(500).json({ msg: "Failed to update book" });
  }
};

module.exports = {
  createBook,
  getMyBooks,
  getBookById,
  updateBook
};
