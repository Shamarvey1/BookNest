const express = require("express");
const { chatWithAI } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Publicly available to reader users
router.post("/chat", chatWithAI);

module.exports = router;
