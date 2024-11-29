const Book = require("../models/BookModels");
const Districtrt = require("../models/District");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const CategoryModels = require("../models/CategoryModels");
const {
  simpleSuccessResponse,
  errorResponse,
  successResponse,
  paginateSuccessResponse,
} = require("../utils/responseHandler");
const District = require("../models/District");
const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const bookUpload = require("../middlewares/bookMulter");

// * * * index methods * * * * * * * * * * * * * * * *
exports.index = async (req, res) => {
  try {
    const {
      search,
      limit = 20,
      page = 1,
      category = "",
      location = "",
    } = req.query;

    const limitNum = Math.min(parseInt(limit, 10), 100);
    const pageNum = Math.max(parseInt(page, 10), 1);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (location) {
      if (!mongoose.isValidObjectId(location)) {
        return errorResponse(res, "Invalid location ID format", 400);
      }

      const locationExists = await District.exists({ _id: location });
      if (!locationExists) {
        return errorResponse(res, "Invalid location provided", 404);
      }

      query.location = location;
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, "gi") } },
        { slug: { $regex: new RegExp(search, "gi") } },
        { author_name: { $regex: new RegExp(search, "gi") } },
      ];
    }

    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        return errorResponse(res, "Invalid category ID format", 400);
      }

      const categoryExists = await CategoryModels.exists({ _id: category });
      if (!categoryExists) {
        return errorResponse(res, "Invalid category provided", 404);
      }

      query.category = category;
    }

    const total = await Book.countDocuments(query);
    const data = await Book.find(query)
      .populate({
        path: "category",
        model: CategoryModels,
        select: "title slug",
      })
      .populate({
        path: "user",
        model: User,
        select: "name username email avater",
      })
      .populate({
        path: "location",
        model: Districtrt,
        select: "title slug",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    if (!data.length) {
      return successResponse(res, "No books found", []);
    }

    return paginateSuccessResponse(res, data, pageNum, total, limitNum);
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
      author_name,
      publication_name,
      description,
      category,
    } = req.body;
    // Ensure the file is present
    const coverPhoto = req.file.filename;

    if (!coverPhoto) {
      return res.status(400).json({ message: "Cover photo is required" });
    }

    const uniqueSlug = slugify(slug, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@&]/g,
      replacement: "-",
      trim: true,
    });

    const newBook = {
      title,
      slug: uniqueSlug,
      total_page: Number(total_page),
      cover_photo: coverPhoto,
      author_name,
      publication_name,
      description,
      category,
      user: req.user.id,
      location: req.user.location,
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
    const bookItem = await Book.findOne({ slug: slug })
      .populate({
        path: "category",
        model: CategoryModels,
        select: "title slug",
      })
      .populate({
        path: "user",
        model: User,
        populate: {
          path: "location", // Populate user's location field
          model: District, // Ensure this matches your district model name
        },
      })
      .populate({
        path: "location",
        model: Districtrt,
        select: "title slug",
      });
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
  const { _id } = req.params; // Extract book ID from params
  const {
    title,
    slug,
    total_page,
    author_name,
    publication_name,
    description,
    category,
  } = req.body;

  try {
    const uniqueSlug = slugify(slug, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@&]/g,
      replacement: "-",
      trim: true,
    });

    const newUpdateAbleBook = {
      title,
      slug: uniqueSlug,
      total_page: Number(total_page),
      author_name,
      publication_name,
      description,
      category,
    };

    if (req.file) {
      const oldBook = await Book.findById(_id);

      // Delete the old cover photo if it exists
      if (oldBook && oldBook.cover_photo) {
        const oldPath = path.resolve(
          __dirname,
          "../uploads/books",
          oldBook.cover_photo
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Update with the new file
      newUpdateAbleBook.cover_photo = req.file.filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(_id, newUpdateAbleBook, {
      new: true,
    });
    return successResponse(res, updatedBook, "Book Updated successfully", 201);

    // return successResponse(res, bookItem, "Book updated successfully!!");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// * * * destroy method ********************************

exports.destroy = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the book by slug
    const book = await Book.findOne({ slug });
    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    // If the book has a cover image, delete the file
    if (book.coverImage) {
      const imagePath = path.resolve(
        __dirname,
        "../uploads/books",
        book.coverImage
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err.message);
        }
      });
    }

    // Delete the book from the database
    await Book.deleteOne({ slug });

    // Send a success response
    return successResponse(res, null, "Book deleted successfully");
  } catch (error) {
    console.error("Error deleting book:", error.message);
    return errorResponse(res, "An error occurred while deleting the book", 500);
  }
};
