const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

// ---------------- REGISTER ----------------
async function registerUserService({ fullName, email, password, role, phoneNumber }) {
  if (!fullName || !email || !password || !role)
    throw new Error("All fields including role are required");

  const allowedRoles = ["user", "food_partner", "delivery_partner"];
  if (!allowedRoles.includes(role)) throw new Error("Invalid role");

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) throw new Error("User already exists");

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    otp: hashedOtp,
    otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    otpAttempts: 0,
    isOtpVerified: false,
    role,
    phoneNumber,
  });

  if (process.env.NODE_ENV === "development") {
  }
  console.log("OTP for Register - ", otp);

  return { userId: user.id, role: user.role };
}

// ---------------- VERIFY REGISTER OTP ----------------
async function verifyUserOtpService(email, otp) {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const user = await User.findOne({ where: { email: normalizeEmail(email) } });
  if (!user) throw new Error("User not found");

  if (!user.otp) throw new Error("OTP not found");
  if (user.otpAttempts >= 5) throw new Error("Too many attempts");
  if (user.otpExpiresAt < new Date()) throw new Error("OTP expired");

  const isValid = await bcrypt.compare(otp, user.otp);

  if (!isValid) {
    user.otpAttempts += 1;
    await user.save();
    throw new Error("Invalid OTP");
  }

  await user.update({
    isOtpVerified: true,
    otp: null,
    otpExpiresAt: null,
    otpAttempts: 0,
  });

  return { userId: user.id, role: user.role };
}

// ---------------- LOGIN ----------------
async function loginUserService({ email, password, role }) {
  const user = await User.findOne({
    where: { email: normalizeEmail(email), role },
  });

  if (!user) throw new Error("Invalid credentials");

  if (role !== "admin" && !user.isOtpVerified)
    throw new Error("Please verify OTP");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role, tokenVersion: user.tokenVersion ?? 0 },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      status: user.status,
    },
  };
}

// ---------------- FORGOT PASSWORD ----------------
async function forgotPasswordService(email) {
  const user = await User.findOne({ where: { email: normalizeEmail(email) } });

  if (user) {
    const otp = generateOtp();
    user.resetOtp = await bcrypt.hash(otp, 10);
    user.resetOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.resetOtpAttempts = 0;
    user.isResetOtpVerified = false;

    if (process.env.NODE_ENV === "development") {
    }
    console.log("Reset OTP - ", otp);

    await user.save();
  }

  return { message: "If email exists, OTP sent" };
}

// ---------------- VERIFY FORGOT OTP ----------------
async function verifyForgotPasswordOtpService(email, otp) {
  const user = await User.findOne({ where: { email: normalizeEmail(email) } });

  if (!user || !user.resetOtp) throw new Error("OTP not found");
  if (user.resetOtpAttempts >= 5) throw new Error("Too many attempts");
  if (user.resetOtpExpiresAt < new Date()) throw new Error("OTP expired");

  const isValid = await bcrypt.compare(otp, user.resetOtp);

  if (!isValid) {
    user.resetOtpAttempts += 1;
    await user.save();
    throw new Error("Invalid OTP");
  }

  await user.update({
    isResetOtpVerified: true,
    resetOtpAttempts: 0,
  });

  return { message: "OTP verified" };
}

// ---------------- RESET PASSWORD ----------------
async function resetPasswordService(email, newPassword) {
  const user = await User.findOne({ where: { email: normalizeEmail(email) } });

  if (!user) throw new Error("User not found");
  if (!user.isResetOtpVerified) throw new Error("Verify OTP first");
  if (!user.resetOtpExpiresAt || new Date() > user.resetOtpExpiresAt)
    throw new Error("OTP expired");

  await user.update({
    password: newPassword,
    resetOtp: null,
    resetOtpExpiresAt: null,
    resetOtpAttempts: 0,
    isResetOtpVerified: false,
    tokenVersion: (user.tokenVersion ?? 0) + 1,
  });

  return { message: "Password reset successfully" };
}

// ---------------- PROFILE ----------------
async function fetchUserProfile(userId) {
  const user = await User.findByPk(userId);

  if (!user || user.role !== "user") {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    role: user.role,
    status: user.status,
    isOtpVerified: user.isOtpVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function updateUserProfile(userId, data) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const updates = {};

  if (data.fullName !== undefined) updates.fullName = data.fullName.trim();
  if (data.phoneNumber !== undefined) updates.phoneNumber = data.phoneNumber;
  if (data.profileImage !== undefined) updates.profileImage = data.profileImage;

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields provided");
  }

  await user.update(updates);

  // CLEAN RESPONSE
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    role: user.role,
    status: user.status,
    isOtpVerified: user.isOtpVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function updateFoodPartnerTimingService(userId, { openingTime, closingTime }) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "food_partner") {
    throw new Error("Only food partner can update timing");
  }

  await user.update({ openingTime, closingTime });
  return user;
}

async function logoutService(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await user.update({
    tokenVersion: (user.tokenVersion ?? 0) + 1,
  });

  return { message: "Logged out successfully" };
}

module.exports = {
  registerUserService,
  verifyUserOtpService,
  loginUserService,
  forgotPasswordService,
  verifyForgotPasswordOtpService,
  resetPasswordService,
  updateFoodPartnerTimingService,
  logoutService,
  fetchUserProfile,
  updateUserProfile,
};
