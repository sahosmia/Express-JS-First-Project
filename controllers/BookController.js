const Book = require("../models/BookModels");
const Joi = require("joi");

const CategoryModels = require("../models/CategoryModels");

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

    const schema = Joi.object({
      title: Joi.string(),
    });

    const { error, value } = schema.validate({ a: "a string" });

    if (
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
        .json({ message: "Missing required fields.", status: 400 });
    }

    // check the slug is unique
    const slugIsUnique = await Book.findOne({ slug: slug });
    if (slugIsUnique) {
      return res
        .status(400)
        .json({ message: "Slug is already in use.", status: 400 });
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

    res.status(201).json({
      data: savedBook,
      message: "New book created successfully!!",
      status: 201,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
      status: 201,
    });
  }
};

// * * * show method ********************************

exports.show = async (req, res) => {
  try {
    const { slug } = req.params;
    const bookItem = await Book.findOne({ slug: slug });
    if (!bookItem) {
      return res
        .status(404)
        .json({ data: null, message: "Book not found.", status: 404 });
    }
    return res.json({
      data: bookItem,
      message: "Book fetched successfully!!",
      status: 200,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Somthing error", status: 500, error: err.message });
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
      return res
        .status(404)
        .json({ data: null, message: "Book not found.", status: 404 });
    }

    // Step 4: If the slug has changed, check if the new slug is unique
    if (slug !== bookItem.slug) {
      const slugIsUnique = await Book.findOne({ slug });
      if (slugIsUnique) {
        return res
          .status(400)
          .json({ message: "Slug is already in use.", status: 400 });
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

    // Step 6: Save changes to the database
    await bookItem.save();

    // Step 7: Return a success response
    res.status(200).json({
      data: bookItem,
      message: "Book updated successfully!",
      status: 200,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Somthing error", status: 500, error: err.message });
  }
};

// * * * destroy method ********************************

exports.destroy = async (req, res) => {
  try {
    const { slug } = req.params;
    const bookItem = await Book.findOne({ slug: slug });
    if (!bookItem) {
      return res
        .status(404)
        .json({ data: null, message: "Book not found.", status: 404 });
    }

    await Book.deleteOne({ slug: slug });

    res
      .status(200)
      .json({ message: "Book deleted successfully.", status: 200 });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Somthing error", status: 500, error: err.message });
  }
};
