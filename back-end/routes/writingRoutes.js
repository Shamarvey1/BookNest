const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createBook,
  getMyBooks,
  getBookById,
  updateBook,
  deleteBook
} = require("../controllers/writingController");

const router = express.Router();

router.use(protect);

router.post("/", createBook);
router.get("/", getMyBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
