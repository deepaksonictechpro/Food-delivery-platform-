const Joi = require("joi");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");

const placeOrderSchema = Joi.object({
  addressId: Joi.number().integer().positive(),
  addressLabel: Joi.string().trim().min(1),
  paymentMethod: Joi.string().valid("COD", "ONLINE", "WALLET").required(),
}).or("addressId", "addressLabel").messages({
  "object.missing": "Either addressId or addressLabel is required",
});

const updateDeliveryStatusSchema = Joi.object({
  status: Joi.string().valid(
    ORDER_STATUS.PENDING,
    ORDER_STATUS.ACCEPTED,
    ORDER_STATUS.PICKED_UP,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCEL_REQUESTED,
    ORDER_STATUS.CANCELLED
  ).required(),
});

module.exports = { placeOrderSchema, updateDeliveryStatusSchema };