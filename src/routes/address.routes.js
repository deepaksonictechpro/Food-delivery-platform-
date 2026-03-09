const express = require("express");
const router = express.Router();

const addressController = require("../controllers/address.controller");
const validate = require("../middlewares/validate.middleware");
const { createAddressSchema, updateAddressSchema } = require("../validations/address.validation");

const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");

// ====================================== User Address APIs ===================================

//--------------------------------------- Add new address -------------------------------------

router.post(
  "/add-new-address",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(createAddressSchema),
  addressController.addAddress
);

// ---------------------------------- Get user addresses --------------------------------------

router.get(
  "/get-address",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  addressController.getUserAddresses
);

// --------------------------------------- Update address -------------------------------------

router.patch(
  "/:id",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(updateAddressSchema),
  addressController.updateAddress
);

// ------------------------------------- Delete address ---------------------------------------

router.delete(
  "/:id",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  addressController.deleteAddress
);



module.exports = router;