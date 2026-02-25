const { User, Food, DeliveryOrder } = require("../models");
const { Sequelize } = require("sequelize");

/* ========================== FOOD PARTNER DASHBOARD ========================== */
const getFoodPartnerDashboard = async (req, res) => {
  try {
    const foodPartnerId = req.user.id;

    // Total orders
    const totalOrders = await DeliveryOrder.count({
      include: [
        {
          model: Food,
          as: "food",
          where: { foodPartnerId },
        },
      ],
    });

    // Total revenue (delivered orders)
    const totalRevenueData = await DeliveryOrder.findAll({
      include: [
        {
          model: Food,
          as: "food",
          where: { foodPartnerId },
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.fn("SUM", Sequelize.literal("quantity * food.price")), "totalRevenue"],
      ],
      where: { status: "delivered" },
      raw: true,
    });

    const totalRevenue = totalRevenueData[0].totalRevenue || 0;

    // Best-selling foods
    const bestSellingFoods = await DeliveryOrder.findAll({
      include: [
        {
          model: Food,
          as: "food",
          where: { foodPartnerId },
          attributes: ["id", "name", "price"],
        },
      ],
      attributes: [
        "foodId",
        [Sequelize.fn("COUNT", Sequelize.col("foodId")), "orderCount"],
      ],
      group: ["foodId", "food.id", "food.name", "food.price"],
      order: [[Sequelize.literal("orderCount"), "DESC"]],
    });

    // Total foods uploaded by this partner
    const totalFoods = await Food.count({ where: { foodPartnerId } });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalFoods,
        bestSellingFoods,
      },
    });
  } catch (error) {
    console.error("[FoodPartnerDashboard]", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to load Food Partner dashboard",
      error: error.message,
    });
  }
};

/* ========================== ADMIN DASHBOARD ========================== */
const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalFoods,
      foodPartners,
      deliveryPartners,
      totalOrders,
    ] = await Promise.all([
      User.count(),
      Food.count(),
      User.count({ where: { role: "food_partner" } }),
      User.count({ where: { role: "delivery_partner" } }),
      DeliveryOrder.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalFoods,
        foodPartners,
        deliveryPartners,
        totalOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load admin dashboard" });
  }
};

/* ========================== EXPORTS ========================== */
module.exports = {
  getFoodPartnerDashboard,
  getAdminDashboardStats,
};