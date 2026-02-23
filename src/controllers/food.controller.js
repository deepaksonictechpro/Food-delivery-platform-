const { Food, User, Like, Save } = require("../models");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

/* ================= CREATE FOOD (VIDEO UPLOAD + UNIQUE NAME) ================= */
async function createFood(req, res) {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) 
      return res.status(400).json({ message: "Food name is required" });

    if (!req.file) 
      return res.status(400).json({ message: "Food video is required" });

    // Check if food name already exists (Controller-level)
    const existingFood = await Food.findOne({ where: { name } });
    if (existingFood) {
      return res.status(400).json({ message: `Food with name '${name}' already exists` });
    }

    // Upload video
    const uploadResult = await storageService.uploadFile(req.file.buffer, `food-video-${uuid()}`);

    // Create food
    const food = await Food.create({
      name,
      description,
      video: uploadResult.url,
      foodPartnerId: req.user.id, // ✅ Use req.user.id
    });

    return res.status(201).json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    // Check for DB-level unique constraint error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: `Food with name '${req.body.name}' already exists` });
    }

    console.error("CREATE FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= GET ALL FOOD ================= */
async function getFoodItems(req, res) {
  try {
    const foodItems = await Food.findAll({
      include: [
        {
          model: User,
          as: "foodPartner",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });
  } catch (error) {
    console.error("GET FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= LIKE FOOD ================= */
async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user.id;

    if (!foodId) return res.status(400).json({ message: "foodId is required" });

    const existing = await Like.findOne({ where: { userId, foodId } });

    if (existing) {
      await existing.destroy();
      await Food.increment({ likeCount: -1 }, { where: { id: foodId } });
      return res.json({ message: "Food unliked" });
    }

    await Like.create({ userId, foodId });
    await Food.increment({ likeCount: 1 }, { where: { id: foodId } });

    return res.status(201).json({ message: "Food liked" });
  } catch (error) {
    console.error("LIKE FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= SAVE FOOD ================= */
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user.id;

    if (!foodId) return res.status(400).json({ message: "foodId is required" });

    const existing = await Save.findOne({ where: { userId, foodId } });

    if (existing) {
      await existing.destroy();
      await Food.increment({ savesCount: -1 }, { where: { id: foodId } });
      return res.json({ message: "Food unsaved" });
    }

    await Save.create({ userId, foodId });
    await Food.increment({ savesCount: 1 }, { where: { id: foodId } });

    return res.status(201).json({ message: "Food saved" });
  } catch (error) {
    console.error("SAVE FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= GET SAVED FOOD ================= */
async function getSaveFood(req, res) {
  try {
    const userId = req.user.id;

    const savedFoods = await Save.findAll({
      where: { userId },
      include: [
        {
          model: Food,
          include: [
            {
              model: User,
              as: "foodPartner",
              attributes: ["id", "fullName"],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Saved foods fetched",
      savedFoods,
    });
  } catch (error) {
    console.error("GET SAVED FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
