const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataFilePath = path.join(__dirname, "../data/books.json");

const readBooksData = () => JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
const writeBooksData = (data) =>
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

router.post("/", (req, res) => {
  const newBook = req.body;
  const books = readBooksData();

  if (
    books.some((book) => parseInt(book.id, 10) === parseInt(newBook.id, 10))
  ) {
    res.status(400).send({ message: "Book ID already exists" });
  }
  books.push(newBook);
  writeBooksData(books);
  res.status(201).json(newBook);
});

router.get("/", (req, res) => {
  const books = readBooksData();
  res.json(books);
});

router.get("/:id", (req, res) => {
  const books = readBooksData();
  const book = books.find(
    (b) => parseInt(b.id, 10) === parseInt(req.params.id, 10)
  );

  if (!book) {
    res.status(404).send({ message: "Book not found" });
  }
  res.json(book);
});

router.put("/:id", (req, res) => {
  const books = readBooksData();
  const bookIndex = books.findIndex(
    (b) => parseInt(b.id) === parseInt(req.params.id, 10)
  );

  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  if (bookIndex === -1) {
    res.status(404).send({ message: "Book not found" });
  }

  books[bookIndex] = { ...books[bookIndex], ...req.body };
  writeBooksData(books);
  res.json(books[bookIndex]);
});

router.delete("/:id", (req, res) => {
  const books = readBooksData();
  const updatedBooks = books.filter(
    (b) => parseInt(b.id, 10) !== parseInt(req.params.id, 10)
  );

  if (books.length === updatedBooks.length) {
    return res.status(404).json({ error: "Book not found." });
  }

  writeBooksData(updatedBooks);
  res.json({ message: "Book deleted successfully." });
});

module.exports = router;
