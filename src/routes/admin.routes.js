const express = require("express");
const router = express.Router();
const { authAdminMiddleware } = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");
const upload = require("../middlewares/upload.middleware");


//------------------------------------- Get all users ---------------------------------------
router.get("/users", authAdminMiddleware, adminController.getAllUsers);

//------------------------------------- Get all foods --------------------------------------
router.get("/foods", authAdminMiddleware, adminController.getAllFoods);

//------------------------------------- Get all food partners --------------------------------------
router.get("/partners/food", authAdminMiddleware, adminController.getAllFoodPartners);

//------------------------------------- Get all delivery partners --------------------------------
router.get("/partners/delivery", authAdminMiddleware, adminController.getAllDeliveryPartners);

//------------------------------------- Get admin profile ---------------------------------------
router.get("/profile", authAdminMiddleware, adminController.getAdminProfile);

//------------------------------------- Update admin profile ---------------------------------------
router.put(
  "/profile",
  authAdminMiddleware,
  upload.single("profileImage"),
  adminController.updateAdminProfile
);


module.exports = router;