const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Helper to extract token from header/cookies
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;
};

// ==================================== AUTH USER ==================================================
const authUserMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) return res.status(401).json({ message: "Please login first" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("[AuthMiddleware]", err.message);
    return res.status(401).json({
      message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
};

// ==================================== ROLE-BASED ACCESS ===================================
const authRoleMiddleware = (roles = []) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You are not allowed to access this resource" });
  }
  next();
};

// =================================== ADMIN AUTH ================================================
const authAdminMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) return res.status(401).json({ message: "Admin login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = user; // standardize to req.user
    next();
  } catch (err) {
    console.error("[AuthAdminMiddleware]", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  authUserMiddleware,
  authRoleMiddleware,
  authAdminMiddleware,
};