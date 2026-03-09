const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const validate = require("../middlewares/validate.middleware");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");
const { addToCartSchema, updateCartSchema, removeFromCartSchema } = require("../validations/cart.validation");

// ----------------------------------Add item to cart----------------------------------------

router.post(
  "/add",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(addToCartSchema),
  cartController.addToCart
);

// -------------------------------------- Get user's cart------------------------------------

router.get(
    "/view-cart", 
    authUserMiddleware, 
    authRoleMiddleware(["user"]), 
    cartController.getCart
);

// ------------------------------------ Update cart item quantity --------------------------------

router.patch(
  "/:foodId/update",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(updateCartSchema),
  cartController.updateCartItem
);

// ------------------------------------- Remove item from cart -------------------------------------

router.delete(
  "/:foodId/remove",
  authUserMiddleware,
  authRoleMiddleware(["user"]),
  validate(removeFromCartSchema, "params"),
  cartController.removeCartItem
);



module.exports = router;