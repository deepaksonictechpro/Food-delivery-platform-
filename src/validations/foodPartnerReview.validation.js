const Joi = require("joi");

const createPartnerReviewSchema = Joi.object({
  foodPartnerId: Joi.number().required(),
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().allow("", null),
});

module.exports = {
  createPartnerReviewSchema,
};