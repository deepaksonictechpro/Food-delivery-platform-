const { User, Food } = require("../models");

// ======================================= ADMIN SERVICE ===============================================

//--------------------------------------- Get all users ---------------------------------------------

async function fetchAllUsers() {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
  return users;
}

//--------------------------------------- Get all foods ---------------------------------------------

async function fetchAllFoods() {
  const foods = await Food.findAll({
    order: [["createdAt", "DESC"]],
  });
  return foods;
}


//--------------------------------------- Get all food partner---------------------------------------

async function fetchAllFoodPartners() {
  const partners = await User.findAll({
    where: { role: "food_partner" },
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
  return partners;
}


//--------------------------------------- Get all delivery partners ----------------------------------

async function fetchAllDeliveryPartners() {
  const partners = await User.findAll({
    where: { role: "delivery_partner" },
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
  return partners;
}

module.exports = {
  fetchAllUsers,
  fetchAllFoods,
  fetchAllFoodPartners,
  fetchAllDeliveryPartners,
};