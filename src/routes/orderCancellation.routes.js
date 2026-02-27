const express = require("express");
const router = express.Router();
const {
  requestCancelOrder,
  handleCancelDecision,
  getPendingCancelRequests
} = require("../controllers/orderCancellation.controller");
const validate = require("../middlewares/validate.middleware");
const { cancelRequestSchema, cancelDecisionSchema } = require("../validations/orderCancellation.validation");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");

// ================= USER =================
router.post(
  "/:orderId/cancel-request",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(cancelRequestSchema),
  requestCancelOrder
);

// ================= ADMIN =================
router.get(
  "/pending-requests",
  authUserMiddleware,
  authRoleMiddleware(["admin"]),
  getPendingCancelRequests
);

router.patch(
  "/:orderId/cancel-decision",
  authUserMiddleware,
  authRoleMiddleware(["admin"]),
  validate(cancelDecisionSchema),
  handleCancelDecision
);

module.exports = router;