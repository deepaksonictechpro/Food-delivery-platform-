const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");

const {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyForgotOtpSchema,
  resetPasswordSchema,
  createAdminSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.registerUser
);

router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyUserOtp
);

router.post(
  "/login",
  validate(loginSchema),
  authController.loginUser
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/forgot-password/verify-otp",
  validate(verifyForgotOtpSchema),
  authController.verifyForgotPasswordOtp
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post("/logout", 
  authController.logoutUser
);

// ---------------------------------- CREATE ADMIN ---------------------------------------

router.post(
  "/create-admin",
  validate(createAdminSchema),
  authController.createAdmin
);


module.exports = router;