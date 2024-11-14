const { body } = require("express-validator");
const User = require("../models/User");

// update User Validator

const userUpdateValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .custom(async (username, { req }) => {
      const { _id } = req.params;

      const user = await User.findById(_id);
      if (user) {
        if (username !== user.username) {
          const usernameUnique = await User.findOne({
            username,
            _id: { $ne: _id },
          });
          if (usernameUnique) {
            throw new Error("Username is not available");
          }
        }
      } else {
        throw new Error("User not found");
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (email, { req }) => {
      const { _id } = req.params;

      const user = await User.findById(_id);
      if (user) {
        if (email !== user.email) {
          const emailUnique = await User.findOne({
            email,
            _id: { $ne: _id },
          });
          if (emailUnique) {
            throw new Error("Email is already in use");
          }
        }
      } else {
        throw new Error("User not found");
      }
    }),
  body("location").notEmpty().withMessage("Location is required"),
];

module.exports = { userUpdateValidation };
