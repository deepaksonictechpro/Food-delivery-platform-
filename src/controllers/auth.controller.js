const authService = require("../services/auth.services");
const { updateFoodPartnerTimingService } = require("../services/auth.services");
//-------------------------------- REGISTER -------------------------------------

async function registerUser(req, res) {
  try {
    const result = await authService.registerUserService(req.body);

    res.status(201).json({
      success: true,
      message: "OTP sent. Verify to complete registration",
      userId: result.userId,
      role: result.role,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: "Registration failed",
    });
  }
}

//-------------------------------- VERIFY REGISTER OTP ---------------------------

async function verifyUserOtp(req, res) {
  try {
    const result = await authService.verifyUserOtpService(
      req.body.email,
      req.body.otp
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      ...result,
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: "OTP verification failed",
    });
  }
}

//----------------------------------------- LOGIN -------------------------------------

async function loginUser(req, res) {
  try {
    const result = await authService.loginUserService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
}

//---------------------------------- FORGOT PASSWORD ---------------------------------

async function forgotPassword(req, res) {
  try {
    const result = await authService.forgotPasswordService(req.body.email);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: "Failed to process request",
    });
  }
}

//--------------------------------- VERIFY FORGOT OTP ---------------------------------

async function verifyForgotPasswordOtp(req, res) {
  try {
    const result = await authService.verifyForgotPasswordOtpService(
      req.body.email,
      req.body.otp
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("VERIFY FORGOT OTP ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: "OTP verification failed",
    });
  }
}

//--------------------------------- RESET PASSWORD -------------------------------------

async function resetPassword(req, res) {
  try {
    const result = await authService.resetPasswordService(
      req.body.email,
      req.body.newPassword
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: "Password reset failed",
    });
  }
}

//---------------------------------------- LOGOUT ---------------------------------------

async function logoutUser(req, res) {
  try {
    const result = await authService.logoutService();

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: "Logout failed",
    });
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
    console.error("GET USER PROFILE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
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
    console.error("UPDATE USER PROFILE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}

//---------------------- UPDATE FOOD PARTNER TIMING -------------------------------

async function updateFoodPartnerTiming(req, res) {
  try {
    const user = await updateFoodPartnerTimingService(req.user.id, req.body);

    const responseData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      openingTime: user.openingTime,
      closingTime: user.closingTime,
    };

    res.status(200).json({
      success: true,
      message: "Food partner timing updated successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("[UpdateFoodPartnerTiming]", error.message);
    res.status(500).json({
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
  updateFoodPartnerTiming,
};