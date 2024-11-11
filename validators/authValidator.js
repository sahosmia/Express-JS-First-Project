const { body } = require("express-validator");
const User = require("../models/User");

// register user
const validationRegisterUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .bail()
    .custom(async (email) => {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        throw new Error("Email is already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
  body("location").notEmpty().withMessage("Location is required"),
];

// login user
const validationLoginUser = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
];

module.exports = { validationRegisterUser, validationLoginUser };
