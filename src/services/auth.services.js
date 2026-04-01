const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

// Helper: generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: normalize email
function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

//------------------------------- USER REGISTRATION --------------------------------------

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
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  console.log("OTP for Register - ", otp);

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    otp: hashedOtp,
    otpExpiresAt: otpExpiry,
    otpAttempts: 0,
    isOtpVerified: false,
    role,
    phoneNumber,
  });

  if (process.env.NODE_ENV === "development") {
    console.log(`OTP for ${normalizedEmail}: ${otp}`);
  }

  return { userId: user.id, role: user.role };
}

//------------------------------- VERIFY USER OTP --------------------------------------

async function verifyUserOtpService(email, otp) {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error("User not found");

  if (!user.otp) throw new Error("OTP not found");
  if (user.otpAttempts >= 5) throw new Error("Too many attempts");

  const isValid = await bcrypt.compare(otp, user.otp);

  if (!isValid) {
    user.otpAttempts += 1;
    await user.save();
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  user.isOtpVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  user.otpAttempts = 0;

  await user.save();

  return { userId: user.id, role: user.role };
}

//------------------------------- USER LOGIN --------------------------------------

async function loginUserService({ email, password, role }) {
  if (!email || !password || !role)
    throw new Error("Email, password, and role are required");

  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ where: { email: normalizedEmail, role } });
  if (!user) throw new Error("Invalid email, password, or role");

  if (role !== "admin" && !user.isOtpVerified)
    throw new Error("Please verify OTP before login");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
  };
}

//------------------------------- FORGOT PASSWORD --------------------------------------

async function forgotPasswordService(email) {
  if (!email) throw new Error("Email is required");

  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ where: { email: normalizedEmail } });
  
  if (user) {
    // Only generate and send OTP if user exists
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    console.log("Reset password OTP - ", otp);

    user.otp = hashedOtp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otpAttempts = 0;
    user.isOtpVerified = false;

    await user.save();

    if (process.env.NODE_ENV === "development") {
      console.log(`Forgot OTP for ${normalizedEmail}: ${otp}`);
    }
  }

  // Always return the same message to prevent email enumeration
  return { message: "If the email exists, an OTP has been sent for password reset" };
}

//------------------------------- VERIFY FORGOT PASSWORD OTP --------------------------------------

async function verifyForgotPasswordOtpService(email, otp) {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error("User not found");

  if (user.otpAttempts >= 5) throw new Error("Too many attempts");

  const isValid = await bcrypt.compare(otp, user.otp);

  if (!isValid) {
    user.otpAttempts += 1;
    await user.save();
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  user.isOtpVerified = true;
  await user.save();

  return { message: "OTP verified. You can now reset password" };
}

//------------------------------- RESET PASSWORD --------------------------------------

async function resetPasswordService(email, newPassword) {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error("User not found");

  // Ensure OTP exists
  if (!user.otp) {
    throw new Error("OTP not found or expired");
  }

  // Ensure OTP verified
  if (!user.isOtpVerified) {
    throw new Error("Please verify OTP first");
  }

  // Check expiry
  if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
    throw new Error("OTP expired");
  }

  // HASH PASSWORD (VERY IMPORTANT)
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,

    // CLEAR EVERYTHING
    otp: null,
    otpExpiresAt: null,
    otpAttempts: 0,
    isOtpVerified: false,
  });

  return { message: "Password reset successfully" };
}

//------------------------- UPDATE FOOD PARTNER TIMING SERVICE -----------------------

async function updateFoodPartnerTimingService(userId, { openingTime, closingTime }) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "food_partner") {
    throw new Error("Only food partner can update timing");
  }

  await user.update({ openingTime, closingTime });

  return user;
}

//------------------------- LOGOUT SERVICE -------------------------

async function logoutService() {
  return { message: "Logged out successfully" };
}

//------------------------- FETCH USER PROFILE -------------------------

async function fetchUserProfile(userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password", "otp", "otpExpiresAt", "otpAttempts"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

//------------------------- UPDATE USER PROFILE -------------------------

async function updateUserProfile(userId, data) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updates = {};

  if (data.fullName !== undefined) updates.fullName = data.fullName;
  if (data.phoneNumber !== undefined) updates.phoneNumber = data.phoneNumber;
  if (data.profileImage !== undefined) updates.profileImage = data.profileImage;

  await user.update(updates);

  return user;
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