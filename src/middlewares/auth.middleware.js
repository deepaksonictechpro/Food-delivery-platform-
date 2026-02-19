const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Generic auth middleware
function authMiddleware(model, type) {
  return async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ message: `Please login first (${type})` });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await model.findByPk(decoded.id);
      if (!user) return res.status(401).json({ message: `${type} not found` });

      req.user = user; // ✅ Attach user to req
      next();
    } catch (err) {
      console.error("[AuthMiddleware]", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

// for admin middleware

const authAdminMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token)
      return res.status(401).json({ message: "Admin login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.admin = user; // optional but useful
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


module.exports = {
  authUserMiddleware: authMiddleware(User, "User"),
  authAdminMiddleware,
};
