const authService = require("../services/auth.services");

//-------------------------------- REGISTER -------------------------------------

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

//-------------------------------- VERIFY REGISTER OTP ---------------------------

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

//----------------------------------------- LOGIN -------------------------------------

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

//---------------------------------- FORGOT PASSWORD ---------------------------------

async function forgotPassword(req, res) {
  try {
    const result = await authService.forgotPasswordService(req.body.email);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//--------------------------------- VERIFY FORGOT OTP ---------------------------------

async function verifyForgotPasswordOtp(req, res) {
  try {
    const result = await authService.verifyForgotPasswordOtpService(req.body.email, req.body.otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//--------------------------------- RESET PASSWORD -------------------------------------

async function resetPassword(req, res) {
  try {
    const result = await authService.resetPasswordService(req.body.email, req.body.newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//---------------------------------------- LOGOUT ---------------------------------------

async function logoutUser(req, res) {
  try {
    const result = await authService.logoutService();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ------------------------- GET USER PROFILE -------------------------

async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await authService.fetchUserProfile(userId);

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("GET USER PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ------------------------- UPDATE USER PROFILE -------------------------

async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;

    const data = {
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
    };

    if (req.file) {
      data.profileImage = req.file.path;
    }

    const user = await authService.updateUserProfile(userId, data);

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("UPDATE USER PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
  getUserProfile,
  updateUserProfile,
};