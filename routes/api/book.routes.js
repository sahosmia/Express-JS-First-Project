const express = require("express");
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../../controllers/BookController");
const checkAuth = require("../../middlewares/checkAuth");
const bookUpload = require("../../middlewares/bookMulter");
const router = express.Router();

router.get("/", index);
router.post("/", checkAuth, bookUpload.single("cover_photo"), store);
router.get("/:slug", show);
router.put("/:_id", checkAuth, bookUpload.single("cover_photo"), update);
router.delete("/:slug", destroy);

module.exports = router;
