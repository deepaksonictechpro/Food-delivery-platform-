// src/routes/food-partner.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const foodPartnerController = require("../controllers/food-partner.controller");
const validate = require("../middlewares/validate.middleware");
const { foodPartnerIdParamSchema } = require("../validations/food-partner.validation");
const foodController = require("../controllers/food.controller");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");

//--------------------------------- GET FOOD PARTNER INFO --------------------------------------------
router.get(
  "/:id/food-partner-info",
  authUserMiddleware,
  validate(foodPartnerIdParamSchema, "params"),
  foodPartnerController.getFoodPartnerById
);

//------------------------------ UPDATE FOOD BY FOOD PARTNER ------------------------------------------

router.put(
  "/update-food/:id",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  upload.single("video"),
  foodController.updateFood
);

//------------------------------ DELETE FOOD BY FOOD PARTNER ------------------------------------------

router.delete(
  "/delete-food/:id",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  foodController.deleteFood
);

//------------------------------ GET FOOD ORDERS HISTORY BY FOOD PARTNER -------------------------------

router.get("/orders-history", 
  authUserMiddleware, 
  authRoleMiddleware(["food_partner"]), 
  foodController.getFoodOrders
);

module.exports = router;