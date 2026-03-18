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

router.get("/search", validate(searchFoodSchema, "query"), foodController.searchFoods);

// -- Get food partner's own foods --

router.get(
  "/get-food",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  foodController.getMyFoods
);

router.post(
  "/create-food",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  upload.single("video"),
  validate(createFoodSchema),
  foodController.createFood
);

router.post(
  "/like",
  authUserMiddleware,
  validate(foodActionSchema),
  foodController.likeFood
);

router.post(
  "/save",
  authUserMiddleware,
  validate(foodActionSchema),
  foodController.saveFood
);

router.get(
  "/get-saved-foods",
  authUserMiddleware,
  foodController.getSavedFoods
);


module.exports = router;