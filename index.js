const express = require("express");
const bodyParser = require("body-parser");
const booksRoute = require("./routes/books.js");

const app = express();
app.use(bodyParser.json());

app.use("/books", booksRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
