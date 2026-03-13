const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const {authUserMiddleware,authRoleMiddleware} = require("../middlewares/auth.middleware");
const { userUpload } = require("../middlewares/upload.middleware");


const {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyForgotOtpSchema,
  resetPasswordSchema,
  updateUserProfileSchema,
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

router.get(
  "/user-profile",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  authController.getUserProfile
);

router.put(
  "/update-user-profile",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  userUpload.single("profileImage"),
  validate(updateUserProfileSchema),
  authController.updateUserProfile
);



module.exports = router;