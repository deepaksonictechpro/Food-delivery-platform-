const { DeliveryOrder, Food, User } = require("../models");

// ===== Food Partner =====
async function fetchFoodPartnerById(id) {
  const fp = await User.findOne({
    where: { id, role: "food_partner" },
    attributes: ["id", "fullName", "email", "role", "profileImage", "status"],
  });
  if (!fp) return null;

  const foods = await Food.findAll({
    where: { foodPartnerId: id },
    attributes: ["id", "name", "description", "category", "price", "video", "likeCount", "savesCount", "createdAt"]
  });

  return { ...fp.toJSON(), foods };
}

async function getFoodOrdersService(foodPartnerId) {
  const foods = await Food.findAll({ where: { foodPartnerId }, attributes: ["id"] });
  const foodIds = foods.map(f => f.id);

  const orders = await DeliveryOrder.findAll({
    where: { foodId: foodIds },
    include: [
      { model: Food, as: "food", attributes: ["id", "name", "price", "video"] },
      { model: User, as: "user", attributes: ["id", "fullName"] }
    ],
    order: [["createdAt", "DESC"]]
  });

  return orders;
}

// ===== Profile =====
async function fetchFoodPartnerProfile(foodPartnerId) {
  const partner = await User.findOne({
    where: { id: foodPartnerId, role: "food_partner" },
    attributes: ["id", "fullName", "email", "role", "profileImage", "status"]
  });
  if (!partner) throw new Error("Food Partner not found");
  return partner;
}

async function updateFoodPartnerProfile(foodPartnerId, data) {
  const partner = await User.findOne({ where: { id: foodPartnerId, role: "food_partner" } });
  if (!partner) throw new Error("Food Partner not found");

  await partner.update({
    fullName: data.fullName || partner.fullName,
    email: data.email || partner.email,
    profileImage: data.profileImage || partner.profileImage,
    status: data.status || partner.status
  });

  return {
    id: partner.id,
    fullName: partner.fullName,
    email: partner.email,
    role: partner.role,
    profileImage: partner.profileImage,
    status: partner.status
  };
}

module.exports = {
  fetchFoodPartnerById,
  getFoodOrdersService,
  fetchFoodPartnerProfile,
  updateFoodPartnerProfile
};