const express = require("express");
const router = express.Router();

const deliveryPartnerController = require("../controllers/delivery_partner.controller");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");
const { deliverypartnerUpload } = require("../middlewares/upload.middleware");


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
  deliveryPartnerController.updateDeliveryPartnerProfile
);


module.exports = router;