const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { cancelPremium } = require("../controllers/premiumController");

router.post("/cancel", protect, cancelPremium);

module.exports = router;
