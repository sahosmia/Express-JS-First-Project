/**
 * Sends an error response.
 * @param {Object} res - Express response object.
 * @param {String} error - Error message (default: "Something Error").
 * @param {Number} status - HTTP status code (default: 400).
 * @returns {Object} JSON error response.
 */
const errorResponse = (res, error = "Something Error", status = 400) => {
  return res.status(status).json({ status, error });
};

/**
 * Sends a success response with data.
 * @param {Object} res - Express response object.
 * @param {Object} data - Data to send in the response.
 * @param {String} message - Success message (default: "Request successful").
 * @param {Number} status - HTTP status code (default: 200).
 * @returns {Object} JSON success response.
 */
const successResponse = (
  res,
  data,
  message = "Request successful",
  status = 200
) => {
  return res.status(status).json({ status, message, data });
};

/**
 * Sends a simple success response without data.
 * @param {Object} res - Express response object.
 * @param {String} message - Success message (default: "Operation successful").
 * @param {Number} status - HTTP status code (default: 200).
 * @returns {Object} JSON success response.
 */
const simpleSuccessResponse = (
  res,
  message = "Operation successful",
  status = 200
) => {
  return res.status(status).json({ status, message });
};

/**
 * Sends a paginated success response.
 * @param {Object} res - Express response object.
 * @param {Array} data - Paginated data.
 * @param {Number} page - Current page number.
 * @param {Number} total - Total number of items.
 * @param {Number} limit - Number of items per page.
 * @param {String} message - Success message (default: "Successfully retrieved data").
 * @param {Number} status - HTTP status code (default: 200).
 * @returns {Object} JSON paginated response.
 */
const paginateSuccessResponse = (
  res,
  data,
  page,
  total,
  limit,
  message = "Successfully retrieved data",
  status = 200
) => {
  return res.status(status).json({ status, message, page, limit, total, data });
};

module.exports = {
  errorResponse,
  successResponse,
  simpleSuccessResponse,
  paginateSuccessResponse,
};
