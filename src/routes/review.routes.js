const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");
const {authUserMiddleware} = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createReviewSchema } = require("../validations/review.validation");

module.exports = router;


//------------------------------- ROUTES ----------------------------------------------

router.post(
  "/create-review",
  authUserMiddleware,
  validate(createReviewSchema),
  reviewController.createReview
);

router.get(
  "/get-reviews-by-food/:foodId",
  reviewController.getReviewsByFood
);

router.delete(
  "/delete-review/:reviewId",
  authUserMiddleware,
  reviewController.deleteReview
);

module.exports = router;