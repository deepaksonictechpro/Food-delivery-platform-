const { User, Food, DeliveryOrder} = require("../models");
const { Op, Sequelize } = require("sequelize");

//------------------------------- FOOD PARTNER DASHBOARD SERVICE --------------------------------------

async function fetchFoodPartnerDashboard(foodPartnerId) {
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

  // Total foods uploaded
  const totalFoods = await Food.count({ where: { foodPartnerId } });

  return { totalOrders, totalRevenue, totalFoods, bestSellingFoods };
}

//------------------------------- ADMIN DASHBOARD SERVICE --------------------------------------

async function fetchAdminDashboardStats() {
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

  return { totalUsers, totalFoods, foodPartners, deliveryPartners, totalOrders };
}

//------------------------------- DELIVERY PARTNER DASHBOARD SERVICE --------------------------------------

async function fetchDeliveryPartnerDashboard(deliveryPartnerId) {
  // Total deliveries
  const totalDeliveries = await DeliveryOrder.count({ where: { deliveryPartnerId } });

  // Total earnings
  const totalEarningsData = await DeliveryOrder.findAll({
    where: { deliveryPartnerId, status: "delivered" },
    attributes: [[Sequelize.fn("SUM", Sequelize.col("earning")), "totalEarnings"]],
    raw: true,
  });
  const totalEarnings = totalEarningsData[0].totalEarnings || 0;

  // Today's deliveries
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayDeliveries = await DeliveryOrder.count({
    where: { deliveryPartnerId, status: "delivered", createdAt: { [Op.gte]: startOfToday } },
  });

  // Average delivery time in minutes
  const avgTimeData = await DeliveryOrder.findAll({
    where: { deliveryPartnerId, status: "delivered" },
    attributes: [[Sequelize.fn("AVG", Sequelize.literal("TIMESTAMPDIFF(SECOND, createdAt, updatedAt)")), "avgSeconds"]],
    raw: true,
  });
  const avgSeconds = Number(avgTimeData[0].avgSeconds || 0);
  const avgDeliveryTimeString = `${Math.floor(avgSeconds / 60)} minat`;

  return { totalDeliveries, totalEarnings, todayDeliveries, avgDeliveryTime: avgDeliveryTimeString };
}

module.exports = {
  fetchFoodPartnerDashboard,
  fetchAdminDashboardStats,
  fetchDeliveryPartnerDashboard,
};