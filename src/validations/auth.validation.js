const Joi = require("joi");
const phoneRegex = /^[6-9]\d{9}$/;

//------------------------------- REGISTER -------------------------------------------

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("user", "food_partner", "delivery_partner")
    .required(),

  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be valid 10 digit Indian number",
    }),
});

//------------------------------- VERIFY REGISTER OTP --------------------------------
const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

//------------------------------- LOGIN ----------------------------------------------
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

//------------------------------- FORGOT PASSWORD ------------------------------------

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

//------------------------------- VERIFY FORGOT OTP ----------------------------------

const verifyForgotOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

//------------------------------- RESET PASSWORD -------------------------------------

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
});

// --------------------------- update profile -----------------------------

const updateUserProfileSchema = Joi.object({
  fullName: Joi.string().min(3).optional(),

  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be valid 10 digit",
    }),
});


module.exports = {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyForgotOtpSchema,
  resetPasswordSchema,
  updateUserProfileSchema,
};