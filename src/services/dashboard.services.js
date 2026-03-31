const { User, Food, Order, OrderItem, Review } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");

//------------------------------- FOOD PARTNER DASHBOARD SERVICE --------------------------------------

async function fetchFoodPartnerDashboard(foodPartnerId) {
  const totalOrders = await Order.count({
    include: [
      {
        model: OrderItem,
        as: "items",
        required: true,
        include: [{
          model: Food,
          as: "food",
          where: { foodPartnerId },
        }]
      },
    ],
  });

  const totalRevenueData = await OrderItem.findAll({
    include: [
      {
        model: Food,
        as: "food",
        where: { foodPartnerId },
        attributes: [],
      },
      {
        model: Order,
        as: 'order',
        where: { status: ORDER_STATUS.DELIVERED },
        attributes: []
      }
    ],
    attributes: [
      [Sequelize.fn("SUM", Sequelize.literal("OrderItem.quantity * OrderItem.price")), "totalRevenue"],
    ],
    raw: true,
  });
  const totalRevenue = totalRevenueData[0].totalRevenue || 0;

  const bestSellingFoods = await OrderItem.findAll({
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

  const totalFoods = await Food.count({ where: { foodPartnerId } });

  const foods = await Food.findAll({
    where: { foodPartnerId },
    attributes: ["id", "name"],
    raw: true,
  });

  const foodReviewStats = await Promise.all(
    foods.map(async (food) => {
      const stats = await Review.findOne({
        where: { foodId: food.id },
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("id")), "reviewCount"],
          [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        ],
        raw: true,
      });

      return {
        foodId: food.id,
        foodName: food.name,
        reviewCount: parseInt(stats.reviewCount, 10),
        averageRating: stats.averageRating ? parseFloat(stats.averageRating).toFixed(2) : null,
      };
    })
  );

  return { totalOrders, totalRevenue, totalFoods, bestSellingFoods, foodReviewStats };
}

//------------------------------- ADMIN DASHBOARD SERVICE --------------------------------------

async function fetchAdminDashboardStats() {
  const [totalUsers, totalFoods, foodPartners, deliveryPartners, totalOrders] = await Promise.all([
    User.count(),
    Food.count(),
    User.count({ where: { role: "food_partner" } }),
    User.count({ where: { role: "delivery_partner" } }),
    Order.count(),
  ]);

  const reviewStats = await Review.findOne({
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("id")), "totalReviews"],
      [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
    ],
    raw: true,
  });

  return {
    totalUsers,
    totalFoods,
    foodPartners,
    deliveryPartners,
    totalOrders,
    totalReviews: parseInt(reviewStats.totalReviews, 10),
    averageRating: reviewStats.averageRating ? parseFloat(reviewStats.averageRating).toFixed(2) : null,
  };
}

//------------------------------- DELIVERY PARTNER DASHBOARD SERVICE --------------------------------------

async function fetchDeliveryPartnerDashboard(deliveryPartnerId) {
  const totalDeliveries = await DeliveryOrder.count({ where: { deliveryPartnerId } });

  const totalEarningsData = await DeliveryOrder.findAll({
    where: { deliveryPartnerId, status: "delivered" },
    attributes: [[Sequelize.fn("SUM", Sequelize.col("earning")), "totalEarnings"]],
    raw: true,
  });
  const totalEarnings = totalEarningsData[0].totalEarnings || 0;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayDeliveries = await DeliveryOrder.count({
    where: { deliveryPartnerId, status: "delivered", createdAt: { [Op.gte]: startOfToday } },
  });

  const avgTimeData = await DeliveryOrder.findAll({
    where: { deliveryPartnerId, status: "delivered" },
    attributes: [[Sequelize.fn("AVG", Sequelize.literal("TIMESTAMPDIFF(SECOND, createdAt, updatedAt)")), "avgSeconds"]],
    raw: true,
  });
  const avgSeconds = Number(avgTimeData[0].avgSeconds || 0);
  const avgDeliveryTimeString = `${Math.floor(avgSeconds / 60)} minutes`;

  return { totalDeliveries, totalEarnings, todayDeliveries, avgDeliveryTime: avgDeliveryTimeString };
}

module.exports = {
  fetchFoodPartnerDashboard,
  fetchAdminDashboardStats,
  fetchDeliveryPartnerDashboard,
};