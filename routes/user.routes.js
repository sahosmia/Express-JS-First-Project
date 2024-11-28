const express = require("express");
const {
  indexUser,
  createUser,
  updateUser,
  deleteUser,
  showUser,
  uploadAvater,
} = require("../controllers/UserController");
const validationHandler = require("../middlewares/validationHandler");
const { userUpdateValidation } = require("../validators/userValidator");
const avaterUpload = require("../middlewares/avaterMulter");
const router = express.Router();

router.get("/", indexUser);
router.get("/:id", showUser);
router.post("/upload_avater/:_id", avaterUpload.single("avater"), uploadAvater);
router.put("/:_id", userUpdateValidation, validationHandler, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
