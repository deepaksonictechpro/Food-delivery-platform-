const { Review, Food, DeliveryOrder, sequelize, User } = require("../models");
const { getPagination, getPagingData } = require("../utils/pagination.utility");

//------------------------------- CREATE REVIEW ----------------------------------------------

async function createReviewService({ userId, foodId, rating, review }) {
  const food = await Food.findByPk(foodId);
  if (!food) throw new Error("Food not found");

  const order = await DeliveryOrder.findOne({
    where: { userId, foodId, status: "delivered" },
  });

  if (!order) {
    throw new Error("You can only review purchased food");
  }

  const existing = await Review.findOne({ where: { userId, foodId } });
  if (existing) {
    throw new Error("You already reviewed this food");
  }

  const t = await sequelize.transaction();

  try {
    const newReview = await Review.create(
      { userId, foodId, rating, review },
      { transaction: t }
    );

    const stats = await Review.findAll({
      where: { foodId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      raw: true,
      transaction: t,
    });

    const avgRating = parseFloat(stats[0].avgRating) || 0;
    const totalReviews = stats[0].count || 0;

    await Food.update(
      { averageRating: avgRating, totalReviews },
      { where: { id: foodId }, transaction: t }
    );

    await t.commit();
    return newReview;

  } catch (err) {
    await t.rollback();
    throw err;
  }
}

//------------------------------- GET REVIEWS BY FOOD ----------------------------------------------

async function getReviewsByFoodService({ foodId, page, limit }) {
  const { limit: pageSize, offset } = getPagination(page, limit);

  const data = await Review.findAndCountAll({
  where: { foodId },
  include: [
    {
      model: User,
      as: "user",   
      attributes: ["id", "fullName", "profileImage"]
    },
  ],
  limit: pageSize,
  offset,
  order: [["createdAt", "DESC"]],
});

  return getPagingData(data, page, limit);
}

//------------------------------- DELETE REVIEW ----------------------------------------------

async function deleteReviewService({ userId, reviewId }) {
  const review = await Review.findOne({
    where: { id: reviewId, userId },
  });

  if (!review) {
    throw new Error("Review not found or not authorized");
  }

  const foodId = review.foodId;
  const t = await sequelize.transaction();

  try {
    await review.destroy({ transaction: t });

    const stats = await Review.findAll({
      where: { foodId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      raw: true,
      transaction: t,
    });

    const avgRating = parseFloat(stats[0].avgRating) || 0;
    const totalReviews = stats[0].count || 0;

    await Food.update(
      { averageRating: avgRating, totalReviews },
      { where: { id: foodId }, transaction: t }
    );

    await t.commit();
    return true;

  } catch (err) {
    await t.rollback();
    throw err;
  }
}

module.exports = {
  createReviewService,
  getReviewsByFoodService,
  deleteReviewService,
};