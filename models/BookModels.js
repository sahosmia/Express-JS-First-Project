const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // todo: type will be number and change controller for create and update this filed data type to convert string to number
    total_page: {
      type: String,
      required: true,
    },
    cover_photo: {
      type: String,
      required: true,
    },
    author_name: {
      type: String,
      required: true,
    },
    publication_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
