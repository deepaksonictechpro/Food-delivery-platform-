const service = require("../services/foodPartnerReview.services");

// ================= CREATE =================
async function createReview(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await service.createPartnerReviewService({
      userId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Partner review added successfully",
      data: result,
    });

  } catch (err) {
    next(err);
  }
}

// ================= GET =================
async function getReviews(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await service.getFoodPartnerReviewsService({
      foodPartnerId: req.params.foodPartnerId,
      page,
      limit,
    });

    return res.status(200).json({
      message: "Food partner reviews fetched",
      ...result,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// ================= DELETE =================
async function deleteReview(req, res, next) {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    await service.deletePartnerReviewService({ userId, reviewId });

    res.json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReview,
  getReviews,
  deleteReview,
};