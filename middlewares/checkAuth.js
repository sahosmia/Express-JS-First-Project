const config = require("./../config/config");
const User = require("../models/User");
const { errorResponse } = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");

const jwt_secret = config.secret.jwt_secret;

const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return errorResponse(res, "Error! You are not authenticated!", 401);
    }

    const token = req.headers.authorization.split(" ")[1]; // Extract the token
    if (!token) {
      return errorResponse(res, "Error! You are not authenticated!", 401);
    }

    // Verify the token
    const decodedToken = jwt.verify(token, jwt_secret);

    if (!decodedToken) {
      return errorResponse(res, "Error! Invalid token!", 401);
    }

    const { _id, username } = decodedToken;

    // Check if the user exists in the database
    const user = await User.findOne({ _id, username });
    if (!user) {
      return errorResponse(res, "Error! User not found!", 404);
    }

    // Attach user to the request object for further use
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Error! Token has expired!", 401);
    } else if (err.name === "JsonWebTokenError") {
      return errorResponse(res, "Error! Invalid token!", 401);
    }

    // Handle unexpected errors
    console.error("Authentication Error:", err);
    return errorResponse(res, "Error! Authentication failed!", 500);
  }
};

module.exports = checkAuth;
