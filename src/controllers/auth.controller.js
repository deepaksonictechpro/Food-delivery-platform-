const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

// Helper to generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// =========================
// Register (All Roles: user, food_partner, delivery_partner)
// =========================
async function registerUser(req, res) {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role)
      return res.status(400).json({ message: "All fields including role are required" });

    const allowedRoles = ["user", "food_partner", "delivery_partner"];
    if (!allowedRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const otp = generateOtp();

    const user = await User.create({
      fullName,
      email,
      password, // model will hash automatically
      otp,
      isOtpVerified: false,
      role,
    });

    console.log(`OTP for ${email}: ${otp}`);

    return res.status(201).json({
      message: "OTP sent. Verify to complete registration",
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    console.error("REGISTER USER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// Verify Registration OTP
// =========================
async function verifyUserOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.isOtpVerified = true;
    user.otp = null; // clear OTP after verification
    await user.save();

    return res.status(200).json({
      message: "OTP verified. Registration complete!",
      role: user.role,
      userId: user.id,
    });
  } catch (error) {
    console.error("VERIFY USER OTP ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// Login (All Roles)
// =========================
async function loginUser(req, res) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: "Email, password, and role are required" });

    const user = await User.findOne({ where: { email, role } });
    if (!user) return res.status(400).json({ message: "Invalid email, password, or role" });

    if (!user.isOtpVerified)
      return res.status(401).json({ message: "Please verify OTP before login" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    //  Correct token generation
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: `${role} logged in successfully`,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN USER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// =========================
// Forgot Password (Send OTP)
// =========================
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    user.otp = otp;
    user.isOtpVerified = false; // reset OTP verification for forgot-password
    await user.save();

    console.log(`Forgot password OTP for ${email}: ${otp}`);

    return res.status(200).json({ message: "OTP sent for password reset" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// Verify Forgot Password OTP
// =========================
async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.isOtpVerified = true; // mark OTP verified for reset
    await user.save();

    return res.status(200).json({ message: "OTP verified. You can now reset password" });
  } catch (error) {
    console.error("VERIFY FORGOT OTP ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// =========================
// Reset Password
// =========================
async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Email and new password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isOtpVerified) return res.status(401).json({ message: "Please verify OTP first" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Logout (All Roles)

async function logoutUser(req, res) {
  try {
    // With JWT, just ask client to delete token
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


//  Create Admin Controller
async function createAdmin(req, res) {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingAdmin = await User.findOne({ where: { email, role: "admin" } });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const admin = await User.create({
      fullName,
      email,
      password, // Model will hash automatically
      role: "admin",
    });

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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
