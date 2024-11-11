const express = require("express");
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../../controllers/BookController");
const bookCreateJoiSchema = require("../../validationsShcema/book/bookCreateValidationSchema");
const joiValidation = require("../../middlewares/joiValidation");
const bookUpdateJoiSchema = require("../../validationsShcema/book/bookUpdateValidationSchema");
const router = express.Router();

router.get("/", index);
router.post("/", joiValidation(bookCreateJoiSchema), store);
router.get("/:slug", show);
router.put("/:_id", joiValidation(bookUpdateJoiSchema), update);
router.delete("/:slug", destroy);

module.exports = router;
