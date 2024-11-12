const bcrypt = require("bcrypt");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const config = require("./../config/config");

const jwt = require("jsonwebtoken");
const jwt_secret = config.secret.jwt_secret;

const District = require("../models/District");

exports.register = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    const username = name + "-" + Date.now() + "-" + location;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      username: username,
      email,
      password: passwordHash,
      location,
    };
    const saveUser = await User.create(newUser);
    const user = await User.findOne({ email });
    const locationItem = await District.findOne({ _id: user.location });

    const token = jwt.sign(
      { name: user.name, email: user.email, location: user.location },
      jwt_secret,
      { expiresIn: "1h" }
    );

    return successResponse(res, { user, token, locationItem }, "success", 200);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "Email or password is wrong", 401);
    } else {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return errorResponse(res, "Email or password is wrong", 401);
      }

      const token = jwt.sign(
        { name: user.name, email: user.email, location: user.location },
        jwt_secret,
        { expiresIn: "1h" }
      );
      const locationItem = await District.findOne({ _id: user.location });

      return successResponse(
        res,
        { token, user, locationItem },
        "success",
        200
      );
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.logout = async (req, res) => {
  const user = await User.find({});
  return successResponse(res, user, "success", 200);
};
