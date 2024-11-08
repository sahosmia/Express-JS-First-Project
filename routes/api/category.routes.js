const express = require("express");
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../../controllers/CategoryController");

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.get("/:slug", show);
router.put("/:_id", update);
router.delete("/:slug", destroy);

module.exports = router;
