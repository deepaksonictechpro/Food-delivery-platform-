const reviewService = require("../services/review.services");

//------------------------------- CREATE REVIEW ----------------------------------------------

async function createReview(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await reviewService.createReviewService({
      userId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: result,
    });

  } catch (err) {
    next(err);
  }
}

//------------------------------- GET REVIEWS ----------------------------------------------

async function getReviewsByFood(req, res, next) {
  try {
    const { foodId } = req.params;

    const reviews = await reviewService.getReviewsByFoodService(foodId);

    res.json({
      success: true,
      data: reviews,
    });

  } catch (err) {
    next(err);
  }
}

//------------------------------- DELETE REVIEW ----------------------------------------------

async function deleteReview(req, res, next) {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    await reviewService.deleteReviewService({ userId, reviewId });

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
  getReviewsByFood,
  deleteReview,
};