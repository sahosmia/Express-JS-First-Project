const express = require("express");
const validationHandler = require("../../middlewares/validationHandler");
const { register, login, logout } = require("../../controllers/AuthController");
const {
  validationRegisterUser,
  validationLoginUser,
} = require("../../validators/authValidator");

const router = express.Router();

// Authentication Routes
router.post("/register", validationRegisterUser, validationHandler, register);
router.post("/login", validationLoginUser, validationHandler, login);
router.get("/logout", logout);

module.exports = router;
