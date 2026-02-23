const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ============================
// Authenticate user (JWT)
// ============================
const authUserMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Please login first" });
    }

    // ✅ VERIFY token (NOT sign)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[AuthMiddleware]", err.message);
    return res.status(401).json({
      message:
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token",
    });
  }
};

// ============================
// Role-based access middleware
// ============================
const authRoleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to access this resource",
      });
    }
    next();
  };
};

// ============================
// Admin middleware
// ============================
const authAdminMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Admin login required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.admin = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  authUserMiddleware,
  authRoleMiddleware,   // ✅ NOW EXISTS
  authAdminMiddleware,
};