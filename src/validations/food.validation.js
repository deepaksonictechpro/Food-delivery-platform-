const Joi = require("joi");

// ------------------------------------ CREATE FOOD SCHEMA --------------------------------
const createFoodSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(5).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
});

// --------------------------- LIKE / SAVE FOOD SCHEMA ----------------------------------

const foodActionSchema = Joi.object({
  foodId: Joi.number().integer().positive().required(),
});

//--------------------------- ADD SAVED TO CART SCHEMA -----------------------------

const addSavedToCartSchema = Joi.object({
  foodId: Joi.number().integer().required().messages({
    "any.required": "Food ID is required",
    "number.base": "Food ID must be a number",
  }),
});


// -------------------------------- SEARCH FOOD SCHEMA --------------------------------------

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
  addSavedToCartSchema,
};