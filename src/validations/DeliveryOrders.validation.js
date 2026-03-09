const Joi = require("joi");

// ================= USER: Place Order FROM CART ====================
const placeOrderSchema = Joi.object({
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
    .valid("picked", "delivered") // make sure it matches your service
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be picked or delivered",
    }),
});

module.exports = {
  placeOrderSchema,
  updateDeliveryStatusSchema,
};