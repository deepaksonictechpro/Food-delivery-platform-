const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware");
const deliveryPartnerController = require("../controllers/delivery_partner.controller");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");
const { deliverypartnerUpload } = require("../middlewares/upload.middleware");
const { updateDeliveryPartnerProfileSchema } = require("../validations/delivery_Partner.validation");

// ================= GET PROFILE =================

router.get(
  "/delivery-partner-profile",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliveryPartnerController.getDeliveryPartnerProfile
);


// ================= UPDATE PROFILE =================

router.put(
  "/update-delivery-partner-profile",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  deliverypartnerUpload.single("profileImage"),
  validate(updateDeliveryPartnerProfileSchema),
  deliveryPartnerController.updateDeliveryPartnerProfile
);

module.exports = router;