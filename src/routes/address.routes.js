const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const validate = require("../middlewares/validate.middleware");
const { createAddressSchema, updateAddressSchema } = require("../validations/address.validation");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");
const { userDoorImageUpload } = require("../middlewares/upload.middleware");

// ====================================== User Address routes ===================================

router.post(
  "/add-new-address",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  userDoorImageUpload.single("doorImage"), 
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
  "/update/:id",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  userDoorImageUpload.single("doorImage"), 
  validate(updateAddressSchema),
  addressController.updateAddress
);

router.delete(
  "/delete/:id",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  addressController.deleteAddress
);



module.exports = router;