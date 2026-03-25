const express = require("express");
const multer = require("multer");
const foodController = require("../controllers/food.controller");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { paginationSchema } = require("../validations/pagination.validation");

const {
  createFoodSchema,
  foodActionSchema,
  addSavedToCartSchema,
  advancedFilterSchema,
} = require("../validations/food.validation");


const router = express.Router();
const upload = multer();

// advanced search with filters
router.get("/search", validate(advancedFilterSchema, "query"), foodController.searchFoods);


// -------- GET ALL FOODS (PUBLIC FEED WITH PAGINATION) --------

router.get(
  "/get-all",
  validate(advancedFilterSchema, "query"),
  foodController.getAllFoods
);

// ------ Get food partner's own foods --------

router.get(
  "/get-food",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  validate(paginationSchema, "query"),
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

// ---- FOR USER USE ---------------
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
  validate(paginationSchema, "query"),
  foodController.getSavedFoods
);

router.post(
  "/saved-to-cart",
  authUserMiddleware,
  validate(addSavedToCartSchema),
  foodController.addSavedToCart
);



module.exports = router;