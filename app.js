const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./config/db");

const bookRouter = require("./routes/book.routes");
const userRouter = require("./routes/user.routes");

const app = express();

//  middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

//? routes * * * * * * * * * * * * *
app.use("/books", bookRouter);
app.use(userRouter);

//  default route * * * * * * * * * * * *
app.get("/", (req, res) => {
  console.log("home route");
  res.send("hello");
});

//  Not Found Page 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Page Not Found", status: 404 });
});

// somthing error
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Something went wrong", status: 500 });
});

module.exports = app;
