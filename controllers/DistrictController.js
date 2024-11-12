const District = require("../models/District");
const { errorResponse, successResponse } = require("../utils/responseHandler");

// * * * index methods * * * * * * * * * * * * * * * *
exports.getAllDistrict = async (req, res) => {
  try {
    let data;
    const search = req.query.search;
    const regex = new RegExp(search, "gi");

    // Search functionality with pagination
    data = search
      ? await District.find({
          $or: [{ name: { $regex: regex } }, { slug: { $regex: regex } }],
        })
      : await District.find();

    return successResponse(res, data, "Successfully!", 200);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

exports.getSingleDistrict = async (req, res) => {
  try {
    const { _id } = req.params;
    const item = await District.findOne({ _id });
    if (!item) {
      return errorResponse(res, "District not found.", 404);
    }
    return successResponse(res, item, "District fetched successfully!!");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};
