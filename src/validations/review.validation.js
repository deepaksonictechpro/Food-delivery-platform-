const Joi = require("joi");

//------------------------------- CREATE REVIEW VALIDATION ----------------------------------------------

const createReviewSchema = Joi.object({
  foodId: Joi.number().required(),
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().max(500).allow("", null),
});

module.exports = {
  createReviewSchema,
};