const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const {authUserMiddleware, authAdminMiddleware, authRoleMiddleware} = require("../middlewares/auth.middleware");

// --------------------------------- FOOD PARTNER DASHBOARD -----------------------------------

router.get(
  "/partner",
  authUserMiddleware,
  dashboardController.getFoodPartnerDashboard
);

// ------------------------------------ ADMIN DASHBOARD ----------------------------------------

router.get(
  "/admin/stats",
  authAdminMiddleware,
  dashboardController.getAdminDashboardStats
);

// -------------------------------------- DELIVERY PARTNER DASHBOARD ----------------------------

router.get(
  "/delivery-partner",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  dashboardController.getDeliveryPartnerDashboard
);


module.exports = router;