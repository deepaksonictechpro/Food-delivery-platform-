const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const otpSendLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again after 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.body.email) {
      return req.body.email.toLowerCase().trim();
    }
    return ipKeyGenerator(req);
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many OTP attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.body.email) {
      return req.body.email.toLowerCase().trim();
    }
    return ipKeyGenerator(req); 
  },
});

module.exports = {
  otpSendLimiter,
  otpVerifyLimiter,
};