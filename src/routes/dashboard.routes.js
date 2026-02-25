const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../middlewares/auth.middleware");

/* ========================== FOOD PARTNER DASHBOARD ========================== */
router.get(
  "/partner",
  authUserMiddleware,
  dashboardController.getFoodPartnerDashboard
);

/* ========================== ADMIN DASHBOARD ========================== */
router.get(
  "/admin/stats",
  authAdminMiddleware,
  dashboardController.getAdminDashboardStats
);

module.exports = router;