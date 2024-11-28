const District = require("../models/District");
const User = require("../models/User");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const config = require("./../config/config");
const path = require("path");
const fs = require("fs");

const jwt = require("jsonwebtoken");
const BookModels = require("../models/BookModels");
const CategoryModels = require("../models/CategoryModels");
const jwt_secret = config.secret.jwt_secret;

// index methods
exports.indexUser = async (req, res) => {
  try {
    const users = await User.find();
    return successResponse(res, users, "Users retrieved successfully", 200);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return errorResponse(res, "Internal server error", 500);
  }
};

//update user
exports.showUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const books = await BookModels.find({ user: id })
      .populate("category", "title slug") // Include category title and slug
      .populate("user"); // Include selected user details

    return successResponse(
      res,
      { user, books },
      "User and their books retrieved successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching user or books:", error.message);
    return errorResponse(res, "Internal server error", 500);
  }
};

exports.uploadAvater = async (req, res) => {
  try {
    const { _id } = req.params;

    // Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Remove old avater if it exists
    if (user.avater) {
      const oldPath = path.join(__dirname, "../uploads/avater", user.avater);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); // Delete old avater
      }
    }

    // Set new avater and save user
    user.avater = req.file.filename;
    await user.save();

    return successResponse(res, { user }, "Avater uploaded successfully", 200);
  } catch (error) {
    console.error("Error uploading avater:", error.message);
    return errorResponse(res, "Internal server error", 500);
  }
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

    if (!updatedUser) {
      return errorResponse(res, "User not found", 404);
    }

    const locationItem = await District.findById(updatedUser.location);
    const token = jwt.sign(
      { _id: updatedUser._id, username: updatedUser.username },
      jwt_secret,
      { expiresIn: "1h" }
    );

    return successResponse(
      res,
      { user: updatedUser, token, locationItem },
      "User updated successfully",
      200
    );
  } catch (error) {
    console.error("Error updating user:", error.message);
    return errorResponse(res, "Internal server error", 500);
  }
};

//delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, deletedUser, "User deleted successfully", 200);
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return errorResponse(res, "Internal server error", 500);
  }
};
