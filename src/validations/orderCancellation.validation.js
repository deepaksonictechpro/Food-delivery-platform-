const Joi = require("joi");

// ================= USER CANCEL REQUEST =================
const cancelRequestSchema = Joi.object({
  reason: Joi.string().min(3).max(255).required(),
});

// ================= ADMIN CANCEL DECISION =================
const cancelDecisionSchema = Joi.object({
  decision: Joi.string().valid("approve", "reject").required(),
  adminReason: Joi.string().min(3).max(255).required(),
});

module.exports = { cancelRequestSchema, cancelDecisionSchema };