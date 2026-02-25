const express = require("express");
const router = express.Router();
const { authAdminMiddleware } = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

// Read-only admin routes
router.get("/users", authAdminMiddleware, adminController.getAllUsers);
router.get("/foods", authAdminMiddleware, adminController.getAllFoods);
router.get("/partners/food", authAdminMiddleware, adminController.getAllFoodPartners);
router.get("/partners/delivery", authAdminMiddleware, adminController.getAllDeliveryPartners);

// Dashboard stats
router.get("/stats/dashboard", authAdminMiddleware, adminController.getDashboardStats);

module.exports = router;