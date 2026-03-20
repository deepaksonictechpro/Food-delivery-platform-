const express = require("express");
const router = express.Router();

const controller = require("../controllers/foodPartnerReview.controller");
const validate = require("../middlewares/validate.middleware");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

const {
  createPartnerReviewSchema,
} = require("../validations/foodPartnerReview.validation");

// ================= ROUTES =================

// CREATE REVIEW
router.post(
  "/create-review-food-partner",
  authUserMiddleware,
  validate(createPartnerReviewSchema),
  controller.createReview
);

// GET REVIEWS BY PARTNER
router.get(
  "/food-partner/:foodPartnerId",
  controller.getReviews
);

// DELETE REVIEW
router.delete(
  "/delete/:reviewId",
  authUserMiddleware,
  controller.deleteReview
);

module.exports = router;