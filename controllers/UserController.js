const { users } = require("../models/BookModels");
const District = require("../models/District");
const User = require("../models/User");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const config = require("./../config/config");

const jwt = require("jsonwebtoken");
const jwt_secret = config.secret.jwt_secret;

// index methods
exports.indexUser = (req, res) => {
  res.json(users);
};

//create a new user
exports.createUser = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const newUser = { id: Date.now().toString(), name, email, password };
  users.push(newUser);
  res.status(201).json(newUser);
  console.log("New user added:", newUser);
};

//update user
exports.showUser = (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json(user);
  console.log("User show:", user);
};

//update user
exports.updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, email, username, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, email, username, location },
      { new: true }
    );

    const locationItem = await District.findOne({ _id: updatedUser.location });
    const token = jwt.sign(
      {
        name: updatedUser.name,
        email: updatedUser.email,
        location: updatedUser.location,
      },
      jwt_secret,
      { expiresIn: "1h" }
    );
    console.log(updatedUser);

    return successResponse(
      res,
      { user: updatedUser, token, locationItem },
      "success",
      200
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

//delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found." });
  }
  const deletedUser = users.splice(index, 1)[0];
  res.json(deletedUser);
  console.log("User deleted:", deletedUser);
};
