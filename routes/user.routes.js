const express = require("express");
const {
  indexUser,
  createUser,
  updateUser,
  deleteUser,
  showUser,
} = require("../controllers/UserController");
const joiValidation = require("../middlewares/joiValidation");
const router = express.Router();

router.get("/", indexUser);
router.post("/", createUser);
router.get("/:id", showUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
