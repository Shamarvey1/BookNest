const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require("../controllers/bookmarkController");

router.get("/", protect, getBookmarks);
router.post("/", protect, addBookmark);
router.delete("/:bookId", protect, removeBookmark);

module.exports = router;
 