const Joi = require("joi");

const phoneRegex = /^[6-9]\d{9}$/;

//------------------------------- COMMON FIELDS -------------------------------------------

// Email normalization
const emailField = Joi.string()
  .email()
  .trim()
  .lowercase()
  .required()
  .messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  });

// Password (stronger)
const passwordField = Joi.string()
  .min(6)
  .max(20)
  .required()
  .messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must not exceed 20 characters",
  });

// OTP (strict)
const otpField = Joi.string()
  .length(6)
  .pattern(/^\d{6}$/)
  .required()
  .messages({
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only numbers",
  });

// Phone
const phoneField = Joi.string()
  .pattern(phoneRegex)
  .messages({
    "string.pattern.base": "Phone number must be valid 10 digit Indian number",
  });

//------------------------------- REGISTER -------------------------------------------

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).trim().required().messages({
    "string.empty": "Full name is required",
  }),

  email: emailField,

  password: passwordField,

  role: Joi.string()
    .valid("user", "food_partner", "delivery_partner")
    .required()
    .messages({
      "any.only": "Invalid role selected",
    }),

  phoneNumber: phoneField.optional(),
});

//------------------------------- VERIFY REGISTER OTP --------------------------------

const verifyOtpSchema = Joi.object({
  email: emailField,
  otp: otpField,
});

//------------------------------- LOGIN ----------------------------------------------

const loginSchema = Joi.object({
  email: emailField,
  password: Joi.string().required(),
  role: Joi.string()
    .valid("user", "food_partner", "delivery_partner", "admin")
    .required()
    .messages({
      "any.only": "Invalid role",
    }),
});

//------------------------------- FORGOT PASSWORD ------------------------------------

const forgotPasswordSchema = Joi.object({
  email: emailField,
});

//------------------------------- VERIFY FORGOT OTP ----------------------------------

const verifyForgotOtpSchema = Joi.object({
  email: emailField,
  otp: otpField,
});

//------------------------------- RESET PASSWORD -------------------------------------

const resetPasswordSchema = Joi.object({
  email: emailField,
  newPassword: passwordField,
});

//--------------------------- UPDATE PROFILE -----------------------------

const updateUserProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).trim().optional(),

  phoneNumber: phoneField.optional(),
}).min(1);

//---------------------------- UPDATE FOOD PARTNER TIMING (OPEN/CLOSE) -------------------------

const updateFoodPartnerTimingSchema = Joi.object({
  openingTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "openingTime must be in HH:MM:SS format",
    }),

  closingTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "closingTime must be in HH:MM:SS format",
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
  updateFoodPartnerTimingSchema,
};