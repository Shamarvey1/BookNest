const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createBook,
  getMyBooks,
  getBookById,
  updateBook
} = require("../controllers/writingController");

router.use(protect);

router.post("/", createBook);
router.get("/", getMyBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);


module.exports = router;
