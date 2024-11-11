// validationSchema.js
const Joi = require("joi");
const Book = require("../../models/BookModels");

// Custom slug validator
const slugValidator = async (value, helpers) => {
  const existingBook = await Book.findOne({ slug: value });
  if (existingBook) {
    return helpers.message("Slug is already in use.");
  }
  return value;
};

const bookCreateJoiSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().custom(slugValidator).required(),
  total_page: Joi.number().integer().positive().required(),
  cover_photo: Joi.string().required(),
  author_name: Joi.string().min(3).max(50).required(),
  publication_name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(500).optional(),
  category: Joi.string().min(3).max(30).required(),
});

module.exports = bookCreateJoiSchema;
