const authService = require("../services/auth.services");

// ======================================== REGISTER =================================================

async function registerUser(req, res) {
  try {
    const result = await authService.registerUserService(req.body);
    res.status(201).json({
      message: "OTP sent. Verify to complete registration",
      ...result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ==================================== VERIFY REGISTRATION OTP ====================================

async function verifyUserOtp(req, res) {
  try {
    const result = await authService.verifyUserOtpService(req.body.email, req.body.otp);
    res.status(200).json({
      message: "OTP verified. Registration complete!",
      ...result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ======================================== LOGIN ====================================================

async function loginUser(req, res) {
  try {
    const result = await authService.loginUserService(req.body);
    res.status(200).json({
      message: `${req.body.role} logged in successfully`,
      ...result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ==================================== FORGOT PASSWORD =============================================

async function forgotPassword(req, res) {
  try {
    const result = await authService.forgotPasswordService(req.body.email);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ================================== VERIFY FORGOT PASSWORD OTP ====================================

async function verifyForgotPasswordOtp(req, res) {
  try {
    const result = await authService.verifyForgotPasswordOtpService(req.body.email, req.body.otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ===================================== RESET PASSWORD ===========================================

async function resetPassword(req, res) {
  try {
    const result = await authService.resetPasswordService(req.body.email, req.body.newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ==================================== LOGOUT ============================================

async function logoutUser(req, res) {
  try {
    const result = await authService.logoutService();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ==================================== CREATE ADMIN =======================================

async function createAdmin(req, res) {
  try {
    const result = await authService.createAdminService(req.body);
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      ...result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  registerUser,
  verifyUserOtp,
  loginUser,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  logoutUser,
  createAdmin,
};