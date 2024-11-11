const { errorResponse } = require("../utils/responseHandler");

const joiValidation = (schema) => {
  return async (req, res, next) => {
    try {
      const context = req.params._id ? { _id: req.params._id } : {}; // Include _id in context if updating
      // console.log(context._id);

      const { error, value } = await schema.validate(req.body, {
        context, // Pass context with _id for updates
        abortEarly: false, // Collect all validation errors
      });

      if (error) {
        return errorResponse(
          res,
          error.details.map((detail) => detail.message)
        );
      }

      req.validatedData = value; // Attach validated data to the request
      next(); // Proceed to the next middleware
    } catch (err) {
      return errorResponse(res, "Validation failed");
    }
  };
};

module.exports = joiValidation;
