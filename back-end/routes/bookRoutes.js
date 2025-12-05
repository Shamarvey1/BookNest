const express = require("express");
const router = express.Router();
const {searchBooks,saveBook,getBook,defaultBooks} = require("../controllers/bookController");
const protect = require("../middleware/authMiddleware.js");
router.get("/default",defaultBooks);
router.get("/search",searchBooks);
router.post("/save/:gutenId",protect,saveBook);
router.get("/:id",protect,getBook);
module.exports = router;
