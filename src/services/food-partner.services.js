const { DeliveryOrder, Food, User } = require("../models");

//------------------------------- FOOD PARTNER FIND BY ID --------------------------------------

async function fetchFoodPartnerById(id) {
  const fp = await User.findOne({
    where: { id, role: "food_partner" },
    attributes: ["id", "fullName", "email", "role"],
  });

  if (!fp) return null;

  const foods = await Food.findAll({
    where: { foodPartnerId: id },
    attributes: [
      "id",
      "name",
      "description",
      "category",
      "price",
      "video",
      "likeCount",
      "savesCount",
      "createdAt",
    ],
  });

  return { ...fp.toJSON(), foods };
}

//------------------------------- GET FOOD PARTNER ORDER HISTORY --------------------------------------

async function getFoodOrdersService(foodPartnerId) {
  // Get all foods of this partner
  const foods = await Food.findAll({
    where: { foodPartnerId },
    attributes: ["id"],
  });

  const foodIds = foods.map((f) => f.id);

  // Get orders for these foods
  const orders = await DeliveryOrder.findAll({
    where: { foodId: foodIds },
    include: [
      {
        model: Food,
        as: "food",
        attributes: ["id", "name", "price", "video"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders;
}

module.exports = {
  fetchFoodPartnerById,
  getFoodOrdersService,
};