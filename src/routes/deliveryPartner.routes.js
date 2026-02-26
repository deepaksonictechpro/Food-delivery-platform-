// src/routes/deliveryPartner.routes.js
const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/deliveryPartner.controller");
const validate = require("../middlewares/validate.middleware");
const {
  placeOrderSchema,
  updateDeliveryStatusSchema,
} = require("../validations/deliveryPartner.validation");

const {
  authUserMiddleware,
  authRoleMiddleware,
} = require("../middlewares/auth.middleware");

/* ========================= USER DELIVERY APIS ========================= */

// User places order
router.post(
  "/",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(placeOrderSchema), // ✅ Joi validation
  deliveryController.placeOrder
);

// User sees own orders
router.get(
  "/my-orders",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  deliveryController.getUserOrders
);

/* ====================== DELIVERY PARTNER APIS ========================= */

// Get all available (unassigned) orders
router.get(
  "/available",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliveryController.getAvailableOrders
);

// Accept an order
router.post(
  "/:id/accept",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliveryController.acceptOrder
);

// Get assigned deliveries
router.get(
  "/assigned",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliveryController.getAssignedDeliveries
);

// Update delivery status (picked / delivered)
router.patch(
  "/:id/status",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  validate(updateDeliveryStatusSchema), // ✅ Joi validation
  deliveryController.updateDeliveryStatus
);

module.exports = router;