const Book = require("../models/BookModels");

const CategoryModels = require("../models/CategoryModels");
const {
  simpleSuccessResponse,
  errorResponse,
  successResponse,
  paginateSuccessResponse,
} = require("../utils/responseHandler");

// * * * index methods * * * * * * * * * * * * * * * *
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
      ? await Book.countDocuments({
          $or: [{ title: { $regex: regex } }, { slug: { $regex: regex } }],
        })
      : await Book.countDocuments();

    // Search functionality with pagination
    data = search
      ? await Book.find({
          $or: [{ title: { $regex: regex } }, { slug: { $regex: regex } }],
        })
          .skip(skip)
          .limit(limit)
      : await Book.find()
          .populate({
            path: "category",
            model: CategoryModels,
            select: "title slug",
          })
          .skip(skip)
          .limit(limit);

    return paginateSuccessResponse(res, data, page, total, limit);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * store method ********************************
exports.store = async (req, res) => {
  try {
    const {
      title,
      slug,
      total_page,
      cover_photo,
      author_name,
      publication_name,
      description,
      category,
    } = req.body;

    const newBook = {
      title,
      slug,
      total_page,
      cover_photo,
      author_name,
      publication_name,
      description,
      category,
    };

    const savedBook = await Book.create(newBook);

    return successResponse(
      res,
      savedBook,
      "New book created successfully",
      201
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * show method ********************************

exports.show = async (req, res) => {
  try {
    const { slug } = req.params;
    const bookItem = await Book.findOne({ slug: slug });
    if (!bookItem) {
      return errorResponse(res, "Book not found.", 404);
    }

    return successResponse(res, bookItem, "Book fetched successfully!!");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * update method ********************************
exports.update = async (req, res) => {
  try {
    const { _id } = req.params;
    const bookItem = await Book.findById(_id);

    if (!bookItem) {
      return errorResponse(res, "Book not found", 404);
    }

    if (req.body.slug !== bookItem.slug) {
      const slugIsUnique = await Book.findOne({ slug: req.body.slug });
      if (slugIsUnique) {
        return errorResponse(res, "Slug is already in use");
      }
    }

    bookItem.title = req.body.title;
    bookItem.slug = req.body.slug;
    bookItem.total_page = req.body.total_page;
    bookItem.cover_photo = req.body.cover_photo;
    bookItem.author_name = req.body.author_name;
    bookItem.publication_name = req.body.publication_name;
    bookItem.description = req.body.description;
    bookItem.category = req.body.category;

    await bookItem.save();
    return successResponse(res, bookItem, "Book updated successfully!!");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * destroy method ********************************

exports.destroy = async (req, res) => {
  try {
    const { slug } = req.params;
    const bookItem = await Book.findOne({ slug: slug });
    if (!bookItem) {
      return errorResponse(res, "Book not found", 404);
    }

    await Book.deleteOne({ slug: slug });
    return simpleSuccessResponse(res, "Book deleted successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};
