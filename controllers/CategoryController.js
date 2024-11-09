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

    res.status(200).json({
      status: 200,
      message: "Successful!",
      limit: limit,
      page: page,
      total: total,
      data: data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
      status: 500,
    });
  }
};

// * * * store method * * * * * * * *
exports.store = async (req, res) => {
  try {
    const { title, slug } = req.body;

    const newCategory = { title, slug };
    const savedCategory = await Category.create(newCategory);

    res.status(201).json({
      data: savedCategory,
      message: "New category created successfully!!",
      status: 201,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
      status: 500,
    });
  }
};

// * * * show method * * * * * * * * *
exports.show = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoryItem = await Category.findOne({ slug: slug });
    if (!categoryItem) {
      return res
        .status(404)
        .json({ data: null, message: "Category not found.", status: 404 });
    }
    return res.json({
      data: categoryItem,
      message: "Category fetched successfully!!",
      status: 200,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Somthing error", status: 500, error: err.message });
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

    res.status(200).json({
      data: categoryItem,
      message: "Category updated successfully!",
      status: 200,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Somthing error", status: 500, error: err.message });
  }
};

// * * * destroy method * * * * * * * * *
exports.destroy = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoryItem = await Category.findOne({ slug: slug });
    if (!categoryItem) {
      return res
        .status(404)
        .json({ data: null, message: "Category not found.", status: 404 });
    }

    await Category.deleteOne({ slug: slug });

    res
      .status(200)
      .json({ message: "Category deleted successfully.", status: 200 });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Somthing error", status: 500, error: err.message });
  }
};
