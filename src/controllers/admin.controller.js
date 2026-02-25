const { User, Food, DeliveryOrder } = require("../models");

// ========================================= ADMIN DASHBOARD ==============================================

// -----------------------------------  Get all users ------------------------------------------------
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//------------------------------------  Get all foods  -------------------------------------------------
async function getAllFoods(req, res) {
  try {
    const foods = await Food.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Foods fetched successfully",
      count: foods.length,
      foods,
    });
  } catch (error) {
    console.error("GET FOODS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//--------------------------------------- Get all food partners  ----------------------------------------
async function getAllFoodPartners(req, res) {
  try {
    const partners = await User.findAll({
      where: { role: "food_partner" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Food partners fetched successfully",
      count: partners.length,
      partners,
    });
  } catch (error) {
    console.error("GET FOOD PARTNERS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//---------------------------------- Get all delivery partners  -----------------------------------------
async function getAllDeliveryPartners(req, res) {
  try {
    const partners = await User.findAll({
      where: { role: "delivery_partner" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Delivery partners fetched successfully",
      count: partners.length,
      partners,
    });
  } catch (error) {
    console.error("GET DELIVERY PARTNERS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  getAllUsers,
  getAllFoods,
  getAllFoodPartners,
  getAllDeliveryPartners,
};