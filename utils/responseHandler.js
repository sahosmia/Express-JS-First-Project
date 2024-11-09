const errorResponse = (res, error = "Somthing Error", status = 400) => {
  return res.status(status).json({ error, status });
};

const successResponse = (res, data, message, status = 200) => {
  return res.status(status).json({ data, message, status });
};

const simpleSuccessResponse = (res, message, status = 200) => {
  return res.status(status).json({ message, status });
};

const paginateSuccessResponse = (
  res,
  data,
  page,
  total,
  limit,
  status = 200
) => {
  return res
    .status(status)
    .json({ message: "Successfully!!", status, page, limit, total, data });
};

module.exports = {
  errorResponse,
  successResponse,
  simpleSuccessResponse,
  paginateSuccessResponse,
};
