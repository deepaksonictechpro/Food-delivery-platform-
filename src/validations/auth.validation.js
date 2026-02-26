const Joi = require("joi");

// ================= REGISTER =================
const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("user", "food_partner", "delivery_partner")
    .required(),
});

// ================= VERIFY REGISTER OTP =================
const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// ================= LOGIN =================
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

// ================= FORGOT PASSWORD =================
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// ================= VERIFY FORGOT OTP =================
const verifyForgotOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// ================= RESET PASSWORD =================
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
});

// ================= CREATE ADMIN =================
const createAdminSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyForgotOtpSchema,
  resetPasswordSchema,
  createAdminSchema,
};