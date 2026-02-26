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

// ================= REGISTER =================
router.post(
  "/register",
  validate(registerSchema),
  authController.registerUser
);

// ================= VERIFY REGISTER OTP =================
router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyUserOtp
);

// ================= LOGIN =================
router.post(
  "/login",
  validate(loginSchema),
  authController.loginUser
);

// ================= FORGOT PASSWORD =================
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// ================= VERIFY FORGOT OTP =================
router.post(
  "/forgot-password/verify-otp",
  validate(verifyForgotOtpSchema),
  authController.verifyForgotPasswordOtp
);

// ================= RESET PASSWORD =================
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ================= LOGOUT =================
router.post("/logout", authController.logoutUser);

// ================= CREATE ADMIN =================
router.post(
  "/create-admin",
  validate(createAdminSchema),
  authController.createAdmin
);

module.exports = router;