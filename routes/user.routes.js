const express = require("express");
const {
  indexUser,
  createUser,
  updateUser,
  deleteUser,
  showUser,
} = require("../controllers/UserController");
const validationHandler = require("../middlewares/validationHandler");
const { userUpdateValidation } = require("../validators/userValidator");
const router = express.Router();

router.get("/", indexUser);
router.post("/", createUser);
router.get("/:id", showUser);
router.put("/:_id", userUpdateValidation, validationHandler, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
