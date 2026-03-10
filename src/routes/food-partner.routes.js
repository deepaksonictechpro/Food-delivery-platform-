const express = require("express");
const router = express.Router();
const { authUserMiddleware, authRoleMiddleware } = require("../middlewares/auth.middleware");
const { foodPartnerUpload } = require("../middlewares/upload.middleware");
const foodPartnerController = require("../controllers/food-partner.controller");
const validate = require("../middlewares/validate.middleware");
const { foodPartnerIdParamSchema } = require("../validations/food-partner.validation");
const foodController = require("../controllers/food.controller");

// Existing food CRUD routes
router.get("/:id/food-partner-info", authUserMiddleware, validate(foodPartnerIdParamSchema, "params"), foodPartnerController.getFoodPartnerById);
router.put("/update-food/:id", authUserMiddleware, authRoleMiddleware(["food_partner"]), foodController.updateFood);
router.delete("/delete-food/:id", authUserMiddleware, authRoleMiddleware(["food_partner"]), foodController.deleteFood);
router.get("/orders-history", authUserMiddleware, authRoleMiddleware(["food_partner"]), foodController.getFoodOrders);

// ===== Food Partner Profile =====
router.get("/profile", authUserMiddleware, authRoleMiddleware(["food_partner"]), foodPartnerController.getFoodPartnerProfile);
router.put("/profile", authUserMiddleware, authRoleMiddleware(["food_partner"]), foodPartnerUpload.single("profileImage"), foodPartnerController.updateFoodPartnerProfile);

module.exports = router;