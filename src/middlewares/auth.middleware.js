const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Helper to extract token from header/cookies
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;
};

//--------------------------------- AUTHENTICATE USER --------------------------------------
const authUserMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) return res.status(401).json({ message: "Please login first" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });
    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({ message: "Session expired. Please login again" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[AuthMiddleware]", err.message);
    return res.status(401).json({
      message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
};

//------------------------------- AUTHORIZE ROLES (ROLE-BASED ACCESS) ----------------------------------
const authRoleMiddleware = (roles = []) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You are not allowed to access this resource" });
  }
  next();
};

//------------------------------- AUTHORIZE ADMIN ACCESS --------------------------------------
const authAdminMiddleware = async (req, res, next) => {
  authUserMiddleware(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  });
};

module.exports = {
  authUserMiddleware,
  authRoleMiddleware,
  authAdminMiddleware,
};
