const { FoodPartnerReviews, DeliveryOrder, Food, User } = require("../models");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");
const { getPagination, getPagingData } = require("../utils/pagination.utility");

// ================= CREATE REVIEW =================
async function createPartnerReviewService({ userId, foodPartnerId, rating, review }) {

  const partner = await User.findOne({
    where: { id: foodPartnerId, role: "food_partner" },
  });

  if (!partner) {
    throw new Error("Invalid food partner");
  }


  const order = await DeliveryOrder.findOne({
    where: {
      userId,
      status: ORDER_STATUS.DELIVERED,
    },
    include: [
      {
        model: Food,
        as: "food",
        where: { foodPartnerId },
      },
    ],
  });

  if (!order) {
    throw new Error("You can only review partners you ordered from");
  }

  const newReview = await FoodPartnerReviews.create({
    userId,
    foodPartnerId,
    rating,
    review,
  });

  return newReview;
}

// ================= GET REVIEWS =================
async function getFoodPartnerReviewsService({ foodPartnerId, page, limit }) {
  const { limit: pageSize, offset } = getPagination(page, limit);

  const data = await FoodPartnerReviews.findAndCountAll({
    where: { foodPartnerId },

    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "profileImage"],
      },
    ],

    limit: pageSize,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return getPagingData(data, page, limit);
}

// ================= DELETE REVIEW =================
async function deletePartnerReviewService({ userId, reviewId }) {
  const review = await FoodPartnerReviews.findOne({
    where: { id: reviewId, userId },
  });

  if (!review) {
    throw new Error("Review not found or unauthorized");
  }

  await review.destroy();
}

module.exports = {
  createPartnerReviewService,
  getFoodPartnerReviewsService,
  deletePartnerReviewService,
};