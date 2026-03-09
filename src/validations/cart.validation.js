const Joi = require("joi");

// --------------------------------------Add food to cart--------------------------------
const addToCartSchema = Joi.object({
  foodId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
});

// --------------------------------------Update quantity-----------------------------------
const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

//--------------------------------------- Remove from cart ---------------------------------------
const removeFromCartSchema = Joi.object({
  foodId: Joi.number().integer().required(),
});

module.exports = {
  addToCartSchema,
  updateCartSchema,
  removeFromCartSchema,
};