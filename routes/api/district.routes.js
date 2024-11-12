const express = require("express");

const validationHandler = require("../../middlewares/validationHandler");
const { register, login, logout } = require("../../controllers/AuthController");
const {
  validationRegisterUser,
  validationLoginUser,
} = require("../../validators/authValidator");

const router = express.Router();

router.get("/district", logout);

module.exports = router;
