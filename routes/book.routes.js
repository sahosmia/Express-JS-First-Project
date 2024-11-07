const express = require("express");
const path = require("path");
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../controllers/BookController");
const router = express.Router();

router.get("/", index);
router.post("/", store);
router.get("/:slug", show);
router.patch("/:id", update);
router.delete("/:slug", destroy);

module.exports = router;
