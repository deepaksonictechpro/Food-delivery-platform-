const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authAdminMiddleware } = require("../middlewares/auth.middleware");
const { adminUpload } = require("../middlewares/upload.middleware");

// Existing routes here...
router.get("/users", authAdminMiddleware, adminController.getAllUsers);
router.get("/foods", authAdminMiddleware, adminController.getAllFoods);
router.get("/partners/food", authAdminMiddleware, adminController.getAllFoodPartners);
router.get("/partners/delivery", authAdminMiddleware, adminController.getAllDeliveryPartners);

// ===== Admin Profile =====
router.get("/profile", authAdminMiddleware, adminController.getAdminProfile);
router.put("/profile", authAdminMiddleware, adminUpload.single("profileImage"), adminController.updateAdminProfile);

module.exports = router;