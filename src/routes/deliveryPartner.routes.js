const express = require("express");
const deliveryController = require("../controllers/deliveryPartner.controller");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/* ===== USER DELIVERY APIS ===== */
router.post("/", authUserMiddleware, authRoleMiddleware(["user"]), deliveryController.placeOrder);
router.get("/my-orders", authUserMiddleware, authRoleMiddleware(["user"]), deliveryController.getUserOrders);

/* ===== DELIVERY PARTNER APIS ===== */
router.get("/assigned", authUserMiddleware, authRoleMiddleware(["delivery_partner"]), deliveryController.getAssignedDeliveries);
router.patch("/:id/status", authUserMiddleware, authRoleMiddleware(["delivery_partner"]), deliveryController.updateDeliveryStatus);

module.exports = router;
