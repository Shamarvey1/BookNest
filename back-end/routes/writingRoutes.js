const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createBook,
  getMyBooks,
  getBookById,
  updateBook
} = require("../controllers/writingController");

// All routes are protected
router.use(protect);

router.post("/", createBook);       // Create new book
router.get("/", getMyBooks);         // Get all my books
router.get("/:id", getBookById);     // Get single book
router.put("/:id", updateBook);      // Update book

module.exports = router;
