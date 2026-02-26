const adminService = require("../services/admin.services");

// ========================= ADMIN CONTROLLER =========================

//--------------------------------------- Get all users ---------------------------------------------

async function getAllUsers(req, res) {
  try {
    const users = await adminService.fetchAllUsers();
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

//--------------------------------------- Get all foods ---------------------------------------------

async function getAllFoods(req, res) {
  try {
    const foods = await adminService.fetchAllFoods();
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

//--------------------------------------- Get all food partner---------------------------------------

async function getAllFoodPartners(req, res) {
  try {
    const partners = await adminService.fetchAllFoodPartners();
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

//--------------------------------------- Get all delivery partners ----------------------------------

async function getAllDeliveryPartners(req, res) {
  try {
    const partners = await adminService.fetchAllDeliveryPartners();
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