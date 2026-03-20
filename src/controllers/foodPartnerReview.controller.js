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
async function getReviews(req, res, next) {
  try {
    const { foodPartnerId } = req.params;

    const reviews = await service.getPartnerReviewsService(foodPartnerId);

    res.json({
      success: true,
      data: reviews,
    });

  } catch (err) {
    next(err);
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