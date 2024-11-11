const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./config/db");

const categoryRouter = require("./routes/api/category.routes");
const bookRouter = require("./routes/api/book.routes");
const authRouter = require("./routes/api/auth.routes");
const userRouter = require("./routes/user.routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./controllers/CommonErrorController");
const { zeroPoint } = require("./controllers/HomeController");

const app = express();

//  middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// set view engine
app.set("view engine", "ejs");

//? routes * * * * * * * * * * * * *
app.get("/", zeroPoint);
app.use("/api/categories", categoryRouter);
app.use("/api/books", bookRouter);
app.use("users", userRouter);
app.use(authRouter);

//  Not Found Page 404 and somthing error
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
