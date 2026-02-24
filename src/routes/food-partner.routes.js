const express = require("express");
const foodPartnerController = require("../controllers/food-partner.controller");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

//========================== GET /api/food-partner/:id ==================================
router.get("/:id", authUserMiddleware, foodPartnerController.getFoodPartnerById);

module.exports = router;
