const express = require("express");
const multer = require("multer");
const foodController = require("../controllers/food.controller");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createFoodSchema,
  foodActionSchema,
  searchFoodSchema,
} = require("../validations/food.validation");

const router = express.Router();
const upload = multer();

// ------------------------------- PUBLIC FOOD ENDPOINTS ------------------------------------

router.get("/search", validate(searchFoodSchema, "query"), foodController.searchFoods);

// ------------------------------ Get food partner's own foods --------------------------------

router.get(
  "/mine",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  foodController.getMyFoods
);

// ------------------------------ Create new food item by food partner -------------------------

router.post(
  "/",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  upload.single("video"),
  validate(createFoodSchema),
  foodController.createFood
);

// ------------------------------------- LIKE/ INLIKE FOOD BY USER -------------------------------

router.post(
  "/like",
  authUserMiddleware,
  validate(foodActionSchema),
  foodController.likeFood
);

// ------------------------------------- SAVE/ UNSAVE FOOD BY USER -------------------------------

router.post(
  "/save",
  authUserMiddleware,
  validate(foodActionSchema),
  foodController.saveFood
);

// ------------------------------------- GET USER'S SAVED FOODS -------------------------------

router.get(
  "/saved",
  authUserMiddleware,
  foodController.getSavedFoods
);



module.exports = router;