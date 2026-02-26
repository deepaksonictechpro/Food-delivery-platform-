const Joi = require("joi");

// ================= CREATE FOOD =================
const createFoodSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(5).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
});

// ================= LIKE / SAVE FOOD =================
const foodActionSchema = Joi.object({
  foodId: Joi.number().integer().positive().required(),
});

// ================= SEARCH FOOD =================
const searchFoodSchema = Joi.object({
  keyword: Joi.string().optional(),
  category: Joi.string().optional(),
  minPrice: Joi.number().optional(),
  maxPrice: Joi.number().optional(),
});

module.exports = {
  createFoodSchema,
  foodActionSchema,
  searchFoodSchema,
};