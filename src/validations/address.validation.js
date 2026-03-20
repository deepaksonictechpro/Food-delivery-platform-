const Joi = require("joi");

const createAddressSchema = Joi.object({
  label: Joi.string().min(2).required(),
  address: Joi.string().min(5).required(),
  city: Joi.string().min(2).required(),
  state: Joi.string().min(2).required(),
  zipCode: Joi.string().min(3).required(),
  country: Joi.string().min(2).required(),
  phoneNumber: Joi.string().min(10).required(),
  doorImage: Joi.any().optional(),
});

const updateAddressSchema = Joi.object({
  label: Joi.string().min(2).optional(),
  address: Joi.string().min(5).optional(),
  city: Joi.string().min(2).optional(),
  state: Joi.string().min(2).optional(),
  zipCode: Joi.string().min(3).optional(),
  country: Joi.string().min(2).optional(),
  phoneNumber: Joi.string().min(10).optional(),
  doorImage: Joi.any().optional(),
});

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};