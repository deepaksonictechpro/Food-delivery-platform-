// src/routes/food-partner.routes.js
const express = require("express");
const router = express.Router();

const foodPartnerController = require("../controllers/food-partner.controller");
const validate = require("../middlewares/validate.middleware");
const { foodPartnerIdParamSchema } = require("../validations/food-partner.validation");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

//========================== GET /api/food-partner/:id ==================================
router.get(
  "/:id",
  authUserMiddleware,
  validate(foodPartnerIdParamSchema, "params"), // ✅ Joi validation applied
  foodPartnerController.getFoodPartnerById
);

module.exports = router;