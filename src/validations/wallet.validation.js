const Joi = require("joi");

const addMoneySchema = Joi.object({
  amount: Joi.number().positive().required(),
});

const payWithWalletSchema = Joi.object({
  orderId: Joi.number().required(),
});

module.exports = {
  addMoneySchema,
  payWithWalletSchema,
};