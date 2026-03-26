const cartService = require("../services/cart.services");

//-------------------------------- ADD TO CART --------------------------------------

async function addToCart(req, res) {
  try {
    const { foodId, quantity } = req.body;

    const cartItem = await cartService.addToCartService(
      req.user.id,
      foodId,
      quantity
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

//------------------------------ GET USER'S CART --------------------------------------

async function getCart(req, res) {
  try {
    const { cartItems, totalAmount } = await cartService.getCartService(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: {
        count: cartItems.length,
        totalAmount,
        cartItems,
      }
    });
  } catch (err) {
    console.error("GET CART ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart"
    });
  }
}

//------------------------------ UPDATE CART ITEM QUANTITY --------------------------------------

async function updateCartItem(req, res) {
  try {
    const foodId = Number(req.params.foodId);
    const { quantity } = req.body;

    const cartItem = await cartService.updateCartItemService(
      req.user.id,
      foodId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cartItem,
    });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

//------------------------------ REMOVE ITEM FROM CART --------------------------------------

async function removeCartItem(req, res) {
  try {
    const foodId = parseInt(req.params.foodId);

    const result = await cartService.removeFromCartService(
      req.user.id,
      foodId
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error("REMOVE CART ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};