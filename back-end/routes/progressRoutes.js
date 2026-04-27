const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  upsertProgress,
  getProgress,
  getAllProgress,
  deleteProgress,
} = require("../controllers/progressController");

router.get("/", protect, getAllProgress);
router.get("/:bookId", protect, getProgress);
router.post("/", protect, upsertProgress);
router.delete("/:bookId", protect, deleteProgress);

module.exports = router;
