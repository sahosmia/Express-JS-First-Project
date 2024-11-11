const Joi = require("joi");
const Book = require("../../models/BookModels");

const bookUpdateJoiSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  total_page: Joi.number().integer().positive().required(),
  cover_photo: Joi.string().required(),
  author_name: Joi.string().min(3).max(50).required(),
  publication_name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(500).optional(),
  category: Joi.string().min(3).max(30).required(),
});

module.exports = bookUpdateJoiSchema;
