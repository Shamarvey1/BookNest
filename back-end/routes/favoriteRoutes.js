const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {addFavorite,removeFavorite,getFavorites} = require("../controllers/favoriteController");

router.get("/", protect, getFavorites);
router.post("/", protect, addFavorite);
router.delete("/:bookId", protect, removeFavorite);

module.exports = router;
