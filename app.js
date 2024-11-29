// Dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();
require("./config/db"); // Database connection

// Routers
const categoryRouter = require("./routes/api/category.routes");
const bookRouter = require("./routes/api/book.routes");
const authRouter = require("./routes/api/auth.routes");
const userRouter = require("./routes/user.routes");
const conversationRouter = require("./routes/api/conversation.routes");
const messageRouter = require("./routes/api/message.routes");

// Controllers
const {
  notFoundHandler,
  errorHandler,
} = require("./controllers/CommonErrorController");
const { zeroPoint } = require("./controllers/HomeController");
const {
  getAllDistrict,
  getSingleDistrict,
} = require("./controllers/DistrictController");

// Initialize Express app
const app = express();
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    // ...
  })
);
// Middleware
app.use(helmet()); // Adds security headers
app.use(express.json()); // Parses JSON body
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cors()); // Enables Cross-Origin Resource Sharing

// socket creation
// const io = require("socket.io")(server);
// global.io = io;
// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/categories", categoryRouter);
app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);
app.use("/api/message", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api", authRouter);
app.get("/api/districts", getAllDistrict);
app.get("/api/districts/:_id", getSingleDistrict);

// Health check
app.get("/health", (req, res) =>
  res.status(200).json({ status: "OK", message: "API is running!" })
);

// Error handling
app.use(notFoundHandler); // Handles 404 errors
app.use(errorHandler); // Global error handler

// Export app for server.js
module.exports = app;
