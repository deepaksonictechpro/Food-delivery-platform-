const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const validate = require("../middlewares/validate.middleware");
const { createAddressSchema, updateAddressSchema } = require("../validations/address.validation");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");

// ====================================== User Address routes ===================================

router.post(
  "/add-new-address",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(createAddressSchema),
  addressController.addAddress
);

router.get(
  "/get-address",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  addressController.getUserAddresses
);

router.patch(
  "/:id",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(updateAddressSchema),
  addressController.updateAddress
);

router.delete(
  "/:id",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  addressController.deleteAddress
);



module.exports = router;