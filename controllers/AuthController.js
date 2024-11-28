const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const District = require("../models/District");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const config = require("./../config/config");

const jwt_secret = config.secret.jwt_secret;

// User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email is already registered", 400);
    }

    // Generate unique username
    const username = `${name
      .replace(/\s+/g, "")
      .toLowerCase()}-${Date.now()}-${location
      .replace(/\s+/g, "")
      .toLowerCase()}`;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      username,
      email,
      password: passwordHash,
      location,
    });

    // Get location details
    const locationItem = await District.findById(newUser.location);

    // Generate JWT token
    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username },
      jwt_secret,
      { expiresIn: "1h" }
    );

    // Success response
    return successResponse(
      res,
      { user: newUser, token, locationItem },
      "Registration successful",
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      jwt_secret,
      { expiresIn: "1h" }
    );

    // Fetch location details
    const locationItem = await District.findById(user.location);

    // Success response
    return successResponse(
      res,
      { token, user, locationItem },
      "Login successful",
      200
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// User Logout (Placeholder Example)
exports.logout = async (req, res) => {
  try {
    // Add proper logic for logout if using sessions or token blacklisting
    return successResponse(res, {}, "Logout successful", 200);
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};
