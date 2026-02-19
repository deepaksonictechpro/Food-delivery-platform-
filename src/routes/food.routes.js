const express = require("express");
const foodController = require("../controllers/food.controller");
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = express.Router();
const upload = multer(); // memory storage

// ===== FOOD PARTNER =====
// Create food with video upload
router.post(
  "/",
  authUserMiddleware,
  upload.single("video"),
  foodController.createFood
);

// Get all food reels
router.get("/", foodController.getFoodItems);

// ===== USER =====
router.post("/like", authUserMiddleware, foodController.likeFood);
router.post("/save", authUserMiddleware, foodController.saveFood);
router.get("/saved", authUserMiddleware, foodController.getSaveFood);

module.exports = router;
