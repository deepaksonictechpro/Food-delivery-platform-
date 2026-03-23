const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { userUpload } = require("../middlewares/upload.middleware");

const {
  authUserMiddleware,
  authRoleMiddleware,
} = require("../middlewares/auth.middleware");

const {
  otpSendLimiter,
  otpVerifyLimiter,
} = require("../middlewares/rateLimit.middleware");

const {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyForgotOtpSchema,
  resetPasswordSchema,
  updateUserProfileSchema,
  updateFoodPartnerTimingSchema,
} = require("../validations/auth.validation");

const router = express.Router();

// ---------------- REGISTER ----------------
router.post(
  "/register",
  otpSendLimiter, 
  validate(registerSchema),
  authController.registerUser
);

// ---------------- VERIFY OTP ----------------
router.post(
  "/verify-otp",
  otpVerifyLimiter,
  validate(verifyOtpSchema),
  authController.verifyUserOtp
);

// ---------------- LOGIN ----------------
router.post(
  "/login",
  validate(loginSchema),
  authController.loginUser
);

// ---------------- FORGOT PASSWORD ----------------
router.post(
  "/forgot-password",
  otpSendLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// ---------------- VERIFY FORGOT OTP ----------------
router.post(
  "/forgot-password/verify-otp",
  otpVerifyLimiter,
  validate(verifyForgotOtpSchema),
  authController.verifyForgotPasswordOtp
);

// ---------------- RESET PASSWORD ----------------
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ---------------- LOGOUT ----------------
router.post("/logout", authController.logoutUser);

// ---------------- GET USER PROFILE ----------------
router.get(
  "/user-profile",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  authController.getUserProfile
);

// ---------------- UPDATE USER PROFILE ----------------
router.put(
  "/update-user-profile",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  userUpload.single("profileImage"),
  validate(updateUserProfileSchema),
  authController.updateUserProfile
);


// ---------------Food Partner Timing Update--------
router.patch(
  "/update-timing",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  validate(updateFoodPartnerTimingSchema),
  authController.updateFoodPartnerTiming
);


module.exports = router;