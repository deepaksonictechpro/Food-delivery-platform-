const Joi = require("joi");

// ------------------------------------ CREATE FOOD SCHEMA --------------------------------
const createFoodSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(5).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  description: Joi.string().min(5).optional(),
  price: Joi.number().positive().optional(),
  category: Joi.string().optional(),
  isAvailable: Joi.boolean().optional(),
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

const advancedFilterSchema = Joi.object({
  query: Joi.string(),
  partner: Joi.string(),
  category: Joi.string(),
  minPrice: Joi.number(),
  maxPrice: Joi.number(),
  rating: Joi.number().min(1).max(5),
  available: Joi.boolean(),
  sort: Joi.string().valid("price_asc", "price_desc", "rating", "latest"),
  sortBy: Joi.string(),
  order: Joi.string().valid("ASC", "DESC", "asc", "desc"),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  search: Joi.string(),
});



module.exports = {
  createFoodSchema,
  updateFoodSchema,
  foodActionSchema,
  advancedFilterSchema,
  addSavedToCartSchema,
};
