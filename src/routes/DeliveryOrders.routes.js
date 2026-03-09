const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/DeliveryOrders.controller");
const validate = require("../middlewares/validate.middleware");
const {
  placeOrderSchema,
  updateDeliveryStatusSchema,
} = require("../validations/DeliveryOrders.validation");

const {
  authUserMiddleware,
  authRoleMiddleware,
} = require("../middlewares/auth.middleware");

/* ========================= USER DELIVERY API ========================= */

// Unified: Place order from cart
router.post(
  "/order",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(placeOrderSchema), 
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
  validate(updateDeliveryStatusSchema),
  deliveryController.updateDeliveryStatus
);

module.exports = router;