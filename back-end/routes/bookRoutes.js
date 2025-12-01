const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
router.get("/search", bookController.searchBooks);
router.post("/save/:gutenId", bookController.saveBook);
router.get("/:id", bookController.getBook);

module.exports = router;
