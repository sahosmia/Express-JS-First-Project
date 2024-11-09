const Book = require("../models/BookModels");
const Joi = require("joi");

const CategoryModels = require("../models/CategoryModels");
const {
  sendErrorResponse,
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

    // const schema = Joi.object({
    //   title: Joi.string(),
    // });

    // const { error, value } = schema.validate(req.body);

    if (
      !slug ||
      !total_page ||
      !cover_photo ||
      !author_name ||
      !publication_name ||
      !description ||
      !category
    ) {
      return errorResponse(res, "Missing required fields");
    }

    // check the slug is unique
    const slugIsUnique = await Book.findOne({ slug: slug });
    if (slugIsUnique) {
      return errorResponse(res, "Slug is already in use.");
    }

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
    // Step 1: Retrieve the book's _id from request parameters and new data from the request body
    const { _id } = req.params;
    const { title, slug } = req.body;

    // Step 2: Ensure required fields are provided
    if (
      !title ||
      !slug ||
      !total_page ||
      !cover_photo ||
      !author_name ||
      !publication_name ||
      !description ||
      !category
    ) {
      return res
        .status(400)
        .json({ message: "Title and slug are required.", status: 400 });
    }

    // Step 3: Find the book by _id
    const bookItem = await Book.findById(_id);
    if (!bookItem) {
      return errorResponse(res, "Book not found.", 404);
    }

    // Step 4: If the slug has changed, check if the new slug is unique
    if (slug !== bookItem.slug) {
      const slugIsUnique = await Book.findOne({ slug });
      if (slugIsUnique) {
        return errorResponse(res, "Slug is already in use");
      }
    }

    // Step 5: Update the book's title and slug
    bookItem.title = title;
    bookItem.slug = slug;
    bookItem.total_page = total_page;
    bookItem.cover_photo = cover_photo;
    bookItem.author_name = author_name;
    bookItem.publication_name = publication_name;
    bookItem.description = description;
    bookItem.category = category;

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
