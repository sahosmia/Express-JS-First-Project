const path = require("path");

exports.indexBook = (req, res) => {
  console.log("books");
  res.sendFile(path.join(__dirname, "../views/books/booksView.html"));
};

exports.createBook = (req, res) => {
  console.log("books create");
  res.sendFile(path.join(__dirname, "../views/books/booksCreate.html"));
};

exports.storeBook = (req, res) => {
  console.log("books store");
  // res.sendFile(path.join(__dirname, "../views/books/booksView.html"));
};
