const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

// Helper: generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =================================== REGISTER USER ================================================

async function registerUserService({ fullName, email, password, role }) {
  if (!fullName || !email || !password || !role)
    throw new Error("All fields including role are required");

  const allowedRoles = ["user", "food_partner", "delivery_partner"];
  if (!allowedRoles.includes(role)) throw new Error("Invalid role");

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

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
  return { userId: user.id, role: user.role, otp };
}

// ===================================== VERIFY REGISTRATION OTP ======================================

async function verifyUserOtpService(email, otp) {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  if (user.otp !== otp) throw new Error("Invalid OTP");

  user.isOtpVerified = true;
  user.otp = null;
  await user.save();

  return { userId: user.id, role: user.role };
}

// ======================================== LOGIN =====================================================

async function loginUserService({ email, password, role }) {
  if (!email || !password || !role)
    throw new Error("Email, password, and role are required");

  const user = await User.findOne({ where: { email, role } });
  if (!user) throw new Error("Invalid email, password, or role");

  if (role !== "admin" && !user.isOtpVerified)
    throw new Error("Please verify OTP before login");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

// ====================================== FORGOT PASSWORD ==========================================

async function forgotPasswordService(email) {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const otp = generateOtp();
  user.otp = otp;
  user.isOtpVerified = false;
  await user.save();

  console.log(`Forgot password OTP for ${email}: ${otp}`);
  return { message: "OTP sent for password reset" };
}

// ================================= VERIFY FORGOT PASSWORD OTP =========================================

async function verifyForgotPasswordOtpService(email, otp) {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  if (user.otp !== otp) throw new Error("Invalid OTP");

  user.isOtpVerified = true;
  await user.save();

  return { message: "OTP verified. You can now reset password" };
}

// ===================================== RESET PASSWORD ============================================

async function resetPasswordService(email, newPassword) {
  if (!email || !newPassword) throw new Error("Email and new password are required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  if (!user.isOtpVerified) throw new Error("Please verify OTP first");

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.isOtpVerified = true;
  await user.save();

  return { message: "Password reset successfully" };
}

// ==================================== LOGOUT ============================================

async function logoutService() {
  return { message: "User logged out successfully" };
}

// ================================== CREATE ADMIN =========================================

async function createAdminService({ fullName, email, password }) {
  if (!fullName || !email || !password) throw new Error("All fields are required");

  const existingAdmin = await User.findOne({ where: { email, role: "admin" } });
  if (existingAdmin) throw new Error("Admin already exists");

  const admin = await User.create({
    fullName,
    email,
    password,
    role: "admin",
  });

  const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role },
    token,
  };
}

module.exports = {
  registerUserService,
  verifyUserOtpService,
  loginUserService,
  forgotPasswordService,
  verifyForgotPasswordOtpService,
  resetPasswordService,
  logoutService,
  createAdminService,
};