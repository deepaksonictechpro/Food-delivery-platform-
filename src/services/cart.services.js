const { Cart } = require("../models");
const { sequelize } = require("../config/database");

//------------------------------- ADD TO CART --------------------------------------

async function addToCartService(userId, foodId, quantity) {
  const transaction = await sequelize.transaction();

  try {
    // Check if item already exists
    const existingItem = await Cart.findOne({
      where: { userId, foodId },
      transaction,
      lock: transaction.LOCK.UPDATE // Prevent concurrent updates
    });

    if (existingItem) {
      // Atomically increment quantity
      await Cart.increment('quantity', {
        by: quantity,
        where: { userId, foodId },
        transaction
      });

      await transaction.commit();

      // Return updated item
      return await Cart.findOne({ where: { userId, foodId } });
    } else {
      // Create new cart item
      const newItem = await Cart.create({ userId, foodId, quantity }, { transaction });
      await transaction.commit();
      return newItem;
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

//------------------------------- GET CART ITEMS --------------------------------------

async function getCartService(userId) {
  const cartItems = await Cart.findAll({
    where: { userId },
    include: ["food"],
  });

  if (!cartItems || cartItems.length === 0) {
    return { cartItems: [], totalAmount: 0 };
  }

  const mappedItems = cartItems.map((item) => {
    const foodData = item.food
      ? {
          id: item.food.id,
          name: item.food.name,
          description: item.food.description,
          category: item.food.category,
          price: item.food.price,
          video: item.food.video,
        }
      : null;

    const subTotal = foodData ? parseFloat(foodData.price) * item.quantity : 0;

    return {
      foodId: item.foodId,
      quantity: item.quantity,
      food: foodData,
      subTotal,
    };
  });

  const totalAmount = mappedItems.reduce((sum, item) => sum + item.subTotal, 0);

  return { cartItems: mappedItems, totalAmount };
}

//------------------------------- UPDATE CART ITEM QUANTITY --------------------------------------

async function updateCartItemService(userId, foodId, quantity) {
  const transaction = await sequelize.transaction();

  try {
    const cartItem = await Cart.findOne({
      where: { userId, foodId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!cartItem) {
      await transaction.rollback();
      throw new Error("Item not found in cart");
    }

    // Atomically update quantity
    await Cart.update(
      { quantity: quantity },
      { where: { userId, foodId }, transaction }
    );

    await transaction.commit();

    // Return updated item
    return await Cart.findOne({ where: { userId, foodId } });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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