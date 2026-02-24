const express = require("express");
const router = express.Router();
const { authAdminMiddleware } = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

// All admin routes are read-only
router.get("/users", authAdminMiddleware, adminController.getAllUsers);
router.get("/foods", authAdminMiddleware, adminController.getAllFoods);
router.get("/partners/food", authAdminMiddleware, adminController.getAllFoodPartners);
router.get("/partners/delivery", authAdminMiddleware, adminController.getAllDeliveryPartners);

module.exports = router;