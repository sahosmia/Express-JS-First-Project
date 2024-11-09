const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/responseHandler");

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array());
  }
  next();
};

module.exports = validationHandler;
