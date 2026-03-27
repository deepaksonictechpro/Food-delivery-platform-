const Joi = require("joi");

// GET WALLET → no params needed
const walletSchema = Joi.object({});

// GET TRANSACTIONS → optional pagination (future ready)
const transactionSchema = Joi.object({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
});

module.exports = {
  walletSchema,
  transactionSchema,
};