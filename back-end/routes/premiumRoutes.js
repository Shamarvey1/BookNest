const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { upgradePremium, cancelPremium } = require("../controllers/premiumController");

router.post("/upgrade", protect, upgradePremium);
router.post("/cancel", protect, cancelPremium);

module.exports = router;
