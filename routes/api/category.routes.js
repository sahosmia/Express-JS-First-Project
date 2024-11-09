const express = require("express");
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../../controllers/CategoryController");
const {
  validationCategoryStore,
  validationCategoryUpdate,
} = require("../../validators/categoryValidator");
const validationHandler = require("../../middlewares/validationHandler");

const router = express.Router();

router.get("/", index);
router.post("/", validationCategoryStore, validationHandler, store);
router.get("/:slug", show);
router.put("/:_id", validationCategoryUpdate, validationHandler, update);
router.delete("/:slug", destroy);

module.exports = router;
