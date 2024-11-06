const express = require("express");
const bookRouter = require("./routes/book.routes");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(bookRouter);

app.get("/", (req, res) => {
  console.log("home route");
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
