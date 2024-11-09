const Category = require("../models/CategoryModels");

// * * * index methods * * * * * * * *
exports.index = async (req, res) => {
  try {
    let data;
    const search = req.query.search;
    const regex = new RegExp(search, "gi");
    const limit = req.query.limit || 2;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const total = search
      ? await Category.countDocuments({
          $or: [{ title: { $regex: regex } }, { slug: { $regex: regex } }],
        })
      : await Category.countDocuments();

    // Search functionality with pagination
    data = search
      ? await Category.find({
          $or: [{ title: { $regex: regex } }, { slug: { $regex: regex } }],
        })
          .skip(skip)
          .limit(limit)
      : await Category.find().skip(skip).limit(limit);

    return paginateSuccessResponse(
      res,
      data,
      page,
      total,
      limit
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * store method * * * * * * * *
exports.store = async (req, res) => {
  try {
    const { title, slug } = req.body;

    const newCategory = { title, slug };
    const savedCategory = await Category.create(newCategory);

    return successResponse(
      res,
      savedCategory,
      "New Category created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * show method * * * * * * * * *
exports.show = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoryItem = await Category.findOne({ slug: slug });
    if (!categoryItem) {
      return errorResponse(res, "Category not found.", 404);
    }
    return successResponse(
      res,
      categoryItem,
      "Category fetched successfully!!"
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * update method * * * * * * * * *
exports.update = async (req, res) => {
  try {
    const { _id } = req.params;
    let { title, slug } = req.body;

    const categoryItem = await Category.findById(_id);

    categoryItem.title = title;
    categoryItem.slug = slug;
    await categoryItem.save();

    return successResponse(
      res,
      categoryItem,
      "Category updated successfully!!"
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * destroy method * * * * * * * * *
exports.destroy = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoryItem = await Category.findOne({ slug: slug });
    if (!categoryItem) {
      return errorResponse(res, "Category not found", 404);
    }
    await Category.deleteOne({ slug: slug });
    return simpleSuccessResponse(res, "Category deleted successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};
