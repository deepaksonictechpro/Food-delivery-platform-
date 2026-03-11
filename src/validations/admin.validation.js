const Joi = require("joi");

//------------------------------- CREATE ADMIN ---------------------------------------

const createAdminSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
    createAdminSchema,
}