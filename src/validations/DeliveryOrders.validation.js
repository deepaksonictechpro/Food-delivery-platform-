const Joi = require("joi");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");

const placeOrderSchema = Joi.object({
  address: Joi.string().min(5).required(),
  paymentMethod: Joi.string().valid("cash", "card", "upi").required(),
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