const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware");
const {
  placeOrderSchema,
  updateDeliveryStatusSchema,
} = require("../validations/order.validation");

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
  orderController.placeOrder
);

router.get(
  "/my-orders",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  orderController.getUserOrders
);



//================================= DELIVERY PARTNER APIS ======================================

router.get(
  "/available-orders",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  orderController.getAvailableOrders
);

router.post(
  "/accept-order/:id",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  orderController.acceptOrder
);

router.get(
  "/assigned-deliveries",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  orderController.getAssignedDeliveries
);

router.patch(
  "/update-status/:orderId",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  validate(updateDeliveryStatusSchema),
  orderController.updateDeliveryStatus
);

module.exports = router;