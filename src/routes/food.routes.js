const express = require("express");
const multer = require("multer");
const foodController = require("../controllers/food.controller");
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();
const upload = multer(); // memory storage (for video)

// ============================== PUBLIC ==============================
router.get("/search", foodController.searchFoods);
router.get("/mine", authUserMiddleware, authRoleMiddleware(["food_partner"]), foodController.getMyFoods);

// =========================== FOOD PARTNER (CREATE FOOD + VIDEO) ===============================
router.post(
  "/",
  authUserMiddleware,
  authRoleMiddleware(["food_partner"]),
  upload.single("video"),
  foodController.createFood
);

// ============================== USER ==============================
router.post("/like", authUserMiddleware, foodController.likeFood);
router.post("/save", authUserMiddleware, foodController.saveFood);
router.get("/saved", authUserMiddleware, foodController.getSavedFoods);

module.exports = router;