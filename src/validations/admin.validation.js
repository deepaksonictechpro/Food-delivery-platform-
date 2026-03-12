const Joi = require("joi");

// ================= CREATE ADMIN =================

const createAdminSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// ================= UPDATE ADMIN PROFILE =================

const updateAdminProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).optional(),

  email: Joi.string().email().optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .optional(),
});

module.exports = {
  createAdminSchema,
  updateAdminProfileSchema,
};