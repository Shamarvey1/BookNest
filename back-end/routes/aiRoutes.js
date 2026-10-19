const express = require("express");
const { chatWithAI, assistWriting } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/write-assist", authMiddleware, assistWriting);

module.exports = router;
