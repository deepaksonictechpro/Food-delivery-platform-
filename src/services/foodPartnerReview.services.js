const { FoodPartnerReview, DeliveryOrder, Food, User } = require("../models");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");

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

  const newReview = await FoodPartnerReview.create({
    userId,
    foodPartnerId,
    rating,
    review,
  });

  return newReview;
}

// ================= GET REVIEWS =================
async function getPartnerReviewsService(foodPartnerId) {
  return await FoodPartnerReview.findAll({
    where: { foodPartnerId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

// ================= DELETE REVIEW =================
async function deletePartnerReviewService({ userId, reviewId }) {
  const review = await FoodPartnerReview.findOne({
    where: { id: reviewId, userId },
  });

  if (!review) {
    throw new Error("Review not found or unauthorized");
  }

  await review.destroy();
}

module.exports = {
  createPartnerReviewService,
  getPartnerReviewsService,
  deletePartnerReviewService,
};