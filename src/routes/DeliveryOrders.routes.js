console.log("✅ Delivery Orders Routes Loaded");
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

// ===================================== USER DELIVERY API ===========================================

router.post(
  "/place-order",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(placeOrderSchema), 
  deliveryController.placeOrder
);

router.get(
  "/my-orders",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  deliveryController.getUserOrders
);

//================================= DELIVERY PARTNER APIS ======================================

router.get(
  "/available",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliveryController.getAvailableOrders
);

router.post(
  "/:id/accept",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliveryController.acceptOrder
);

router.get(
  "/assigned",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliveryController.getAssignedDeliveries
);

router.patch(
  "/:id/status",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  validate(updateDeliveryStatusSchema),
  deliveryController.updateDeliveryStatus
);

module.exports = router;