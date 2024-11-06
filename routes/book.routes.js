const express = require("express");
const path = require("path");
const { indexBook, createBook } = require("../controllers/BookController");
const router = express.Router();

router.get("/books", indexBook);
router.get("/books/create", createBook);

module.exports = router;
