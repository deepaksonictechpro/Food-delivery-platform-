const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/verify-otp", authController.verifyUserOtp);
router.post("/login", authController.loginUser);

router.post("/forgot-password", authController.forgotPassword);
router.post("/forgot-password/verify-otp", authController.verifyForgotPasswordOtp);
router.post("/reset-password", authController.resetPassword);

router.post("/logout", authController.logoutUser);

// ✅ ADD Create Admin
router.post("/create-admin", authController.createAdmin);

module.exports = router;
