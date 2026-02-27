const Joi = require("joi");

// ================= USER: Place Order ====================
const placeOrderSchema = Joi.object({
  foodId: Joi.number().integer().required().messages({
    "any.required": "Food ID is required",
    "number.base": "Food ID must be a number",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "any.required": "Quantity is required",
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
  address: Joi.string().min(5).required().messages({
    "any.required": "Delivery address is required",
    "string.base": "Address must be a string",
    "string.min": "Address is too short",
  }),
  paymentMethod: Joi.string()
    .valid("cash", "card", "upi")
    .required()
    .messages({
      "any.required": "Payment method is required",
      "any.only": "Payment method must be one of cash, card, or upi",
    }),
});

// ================= DELIVERY PARTNER: Update Status ====================
const updateDeliveryStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PICKED_UP", "DELIVERED")
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be PICKED_UP or DELIVERED",
    }),
});

module.exports = {
  placeOrderSchema,
  updateDeliveryStatusSchema,
};