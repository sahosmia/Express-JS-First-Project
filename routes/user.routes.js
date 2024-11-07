const express = require("express");
const {
  indexUser,
  createUser,
  updateUser,
  deleteUser,
  showUser,
} = require("../controllers/UserController");
const router = express.Router();

router.get("/users", indexUser);
router.post("/users", createUser);
router.get("/users/:id", showUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
