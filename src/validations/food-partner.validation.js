const Joi = require("joi");

// ================= Path param validation for :id =================
const foodPartnerIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Food partner ID is required",
    "number.base": "Food partner ID must be a number",
    "number.integer": "Food partner ID must be an integer",
    "number.positive": "Food partner ID must be a positive number",
  }),
});

const updateFoodPartnerProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).trim().optional(),
});

module.exports = {
  foodPartnerIdParamSchema,
  updateFoodPartnerProfileSchema,
};
