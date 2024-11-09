const { body } = require("express-validator");
const Category = require("../models/CategoryModels");

// store category
const validationCategoryStore = [
  body("title").notEmpty().withMessage("Title is required"),
  body("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .custom(async (slug) => {
      const slugIsUnique = await Category.findOne({ slug });
      if (slugIsUnique) {
        throw new Error("Slug is already in use");
      }
    }),
];

// update category

const validationCategoryUpdate = [
  body("title").notEmpty().withMessage("Title is required"),
  body("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .custom(async (slug, { req }) => {
      const { _id } = req.params;

      const categoryItem = await Category.findById(_id);
      if (categoryItem) {
        if (slug !== categoryItem.slug) {
          const slugIsUnique = await Category.findOne({
            slug,
            _id: { $ne: _id },
          });
          if (slugIsUnique) {
            throw new Error("Slug is already in use");
          }
        }
      } else {
        throw new Error("Category not found");
      }
    }),
];

module.exports = { validationCategoryStore, validationCategoryUpdate };
