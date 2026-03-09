const express = require("express");
const router = express.Router();
const { authAdminMiddleware } = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

// Read-only admin routes

//------------------------------------- Get all users ---------------------------------------
router.get("/users", authAdminMiddleware, adminController.getAllUsers);

//------------------------------------- Get all orders --------------------------------------
router.get("/foods", authAdminMiddleware, adminController.getAllFoods);

//------------------------------------- Get all orders --------------------------------------
router.get("/partners/food", authAdminMiddleware, adminController.getAllFoodPartners);

//------------------------------------- Get all delivery partners --------------------------------
router.get("/partners/delivery", authAdminMiddleware, adminController.getAllDeliveryPartners);



module.exports = router;