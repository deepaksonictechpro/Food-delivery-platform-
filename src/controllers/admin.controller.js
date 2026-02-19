const bcrypt = require("bcrypt");
//const { User } = require("../models");
const { User, Food } = require("../models");


// USER MANAGEMENT (ADMIN)

//  Get all users (exclude passwords)
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

//  Block user
async function blockUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.update({ isBlocked: true });

    return res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("BLOCK USER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//  Unblock user
async function unblockUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.update({ isBlocked: false });

    return res.json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("UNBLOCK USER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// FOOD MODERATION (ADMIN)

//  Get all foods
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

//  Delete food (Admin moderation)
async function deleteFood(req, res) {
  try {
    const { id } = req.params;

    const food = await Food.findByPk(id);
    if (!food)
      return res.status(404).json({ message: "Food not found" });

    await food.destroy();

    return res.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("DELETE FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// ADMIN DASHBOARD STATS


//  Overview stats
async function getOverviewStats(req, res) {
  try {
    const totalUsers = await User.count();
    const totalFoods = await Food.count();

    const foodPartners = await User.count({
      where: { role: "food_partner" },
    });

    const deliveryPartners = await User.count({
      where: { role: "delivery_partner" },
    });

    return res.status(200).json({
      message: "Admin dashboard stats",
      stats: {
        totalUsers,
        foodPartners,
        deliveryPartners,
        totalFoods,
      },
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// EXPORTS

module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
  getAllFoods,
  deleteFood,
  getOverviewStats,
};

