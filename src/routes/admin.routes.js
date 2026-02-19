const express = require("express");
const router = express.Router();
const { authAdminMiddleware } = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

// User & Partner
router.get("/users", authAdminMiddleware, adminController.getAllUsers);
router.patch("/users/:id/block", authAdminMiddleware, adminController.blockUser);
router.patch("/users/:id/unblock", authAdminMiddleware, adminController.unblockUser);

// Food Moderation
router.get("/foods", authAdminMiddleware, adminController.getAllFoods);
router.delete("/foods/:id", authAdminMiddleware, adminController.deleteFood);

// Dashboard
router.get("/stats/overview", authAdminMiddleware, adminController.getOverviewStats);

module.exports = router;
