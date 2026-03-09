const { Cart } = require("../models");

//------------------------------- ADD TO CART --------------------------------------

async function addToCartService(userId, foodId, quantity) {
  const cartItem = await Cart.findOne({ where: { userId, foodId } });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
    return cartItem;
  }

  return Cart.create({ userId, foodId, quantity });
}

//------------------------------- GET CART ITEMS --------------------------------------

async function getCartService(userId) {
  const cartItems = await Cart.findAll({
    where: { userId },
    include: ["food"],
  });

  // Map to plain objects so foodId & quantity are directly accessible
  return cartItems.map(item => ({
    foodId: item.foodId,
    quantity: item.quantity,
    food: item.food ? {
      id: item.food.id,
      name: item.food.name,
      description: item.food.description,
      category: item.food.category,
      price: item.food.price,
      video: item.food.video,
    } : null,
  }));
}

//------------------------------- UPDATE CART ITEM QUANTITY --------------------------------------

async function updateCartItemService(userId, foodId, quantity) {
  const cartItem = await Cart.findOne({ where: { userId, foodId } });

  if (!cartItem) throw new Error("Item not found in cart");

  cartItem.quantity = quantity;
  await cartItem.save();

  return cartItem;
}

//------------------------------- REMOVE FROM CART --------------------------------------

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