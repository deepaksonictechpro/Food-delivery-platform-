const express = require("express");
const router = express.Router();

const foodPartnerReviewController = require("../controllers/foodPartnerReview.controller");
const validate = require("../middlewares/validate.middleware");
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const { paginationSchema } = require("../validations/pagination.validation");

const {
  createPartnerReviewSchema,
} = require("../validations/foodPartnerReview.validation");



// ================= ROUTES =================

// CREATE REVIEW
router.post(
  "/create-review-food-partner",
  authUserMiddleware,
  validate(createPartnerReviewSchema),
  foodPartnerReviewController.createReview
);

// GET REVIEWS BY PARTNER

router.get(
  "/food-partner-reviews/:foodPartnerId",
  validate(paginationSchema, "query"),
  foodPartnerReviewController.getReviews
);


// DELETE REVIEW
router.delete(
  "/delete/:reviewId",
  authUserMiddleware,
  foodPartnerReviewController.deleteReview
);

module.exports = router;