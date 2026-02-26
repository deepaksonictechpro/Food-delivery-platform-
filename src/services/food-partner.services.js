const { User, Food } = require("../models");

// ==================================== FOOD PARTNER SERVICE =========================================

async function fetchFoodPartnerById(id) {
  const fp = await User.findOne({ where: { id, role: "food_partner" } });
  if (!fp) return null;

  const foods = await Food.findAll({ where: { foodPartnerId: id } });
  return { ...fp.toJSON(), foods };
}

module.exports = {
  fetchFoodPartnerById,
};