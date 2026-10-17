const express = require("express");
const { signup, login } = require("../controllers/authController.js");
const protect  = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/signup",signup);
router.post("/login", login);
router.get("/main", protect, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatarUrl: req.user.avatarUrl,
    isPremium: req.user.isPremium,
    plan: req.user.plan,
    bio: req.user.bio,
  });
});

module.exports = router;

