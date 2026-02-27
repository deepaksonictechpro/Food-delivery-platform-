const { Cart } = require("../models");

// ================= ADD TO CART =================
async function addToCartService(userId, foodId, quantity) {
  const cartItem = await Cart.findOne({ where: { userId, foodId } });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
    return cartItem;
  }

  return Cart.create({ userId, foodId, quantity });
}

// ================= GET CART =================
async function getCartService(userId) {
  return Cart.findAll({
    where: { userId },
    include: ["food"],
  });
}

// ================= UPDATE CART (FIXED) =================
async function updateCartItemService(userId, foodId, quantity) {
  const cartItem = await Cart.findOne({
    where: { userId, foodId },
  });

  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return cartItem;
}

// ================= REMOVE CART ITEM =================
async function removeFromCartService(userId, foodId) {
  const cartItem = await Cart.findOne({ where: { userId, foodId } });
  if (!cartItem) throw new Error("Cart item not found");

  await cartItem.destroy();
  return { message: "Item removed from cart" };
}

module.exports = {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeFromCartService,
};