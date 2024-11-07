const path = require("path");
// const { books } = require("../models/BookModels");

const Book = require("../models/BookModels");
// * * * index methods * * * * * * * * * * * * * * * *
exports.index = async (req, res) => {
  try {
    const datas = await Book.find();
    res
      .status(200)
      .json({ data: datas, message: "Successfull!!", status: 200 });
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
    const { title, slug } = req.body;

    if (!title || !slug) {
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

    const newBook = { title, slug };
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
    /*
    step 1: I will get _id from the query parameters
    step 2: I will get the data from request body (title, slug)
    step 3 : if slug is exist then it will check for uniqe using slug and _id
    step 4: if slug is not exist then it will update the book data
    */
    const { title, slug } = req.body;
    const { _id } = req.params;
    const bookItem = await Book.findOne({ _id });
    if (!bookItem) {
      return res
        .status(404)
        .json({ data: null, message: "Book not found.", status: 404 });
    }
    if (slug && slug !== bookItem.slug) {
      const slugIsUnique = await Book.findOne({ slug: slug });
      if (slugIsUnique) {
        return res
          .status(400)
          .json({ message: "Slug is already in use.", status: 400 });
      }
    }
    bookItem.title = title;
    bookItem.slug = slug;
    await bookItem.save();

    res.json({
      data: bookItem,
      message: "Book updated successfully!!",
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
