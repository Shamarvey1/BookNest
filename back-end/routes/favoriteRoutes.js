const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { addFavorite, getFavorites } = require("../controllers/favoriteController");

router.post("/:gutenId", protect, addFavorite);
router.get("/", protect, getFavorites);

module.exports = router;
