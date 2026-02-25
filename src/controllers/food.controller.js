const { Food, User, Like, Save } = require("../models");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const { Op, Sequelize } = require("sequelize");

// helper: case-insensitive LIKE condition
const ciLike = (column, value) =>
  Sequelize.where(
    Sequelize.fn("LOWER", Sequelize.col(column)),
    { [Op.like]: `%${value.toLowerCase()}%` }
  );

// ========================== CREATE FOOD (VIDEO UPLOAD + UNIQUE NAME) =============================
async function createFood(req, res) {
  try {
    const { name, description, category, price } = req.body;

    if (!name) return res.status(400).json({ message: "Food name is required" });
    if (!category) return res.status(400).json({ message: "Category is required" });
    if (!price) return res.status(400).json({ message: "Price is required" });
    if (!req.file) return res.status(400).json({ message: "Food video is required" });

    const existingFood = await Food.findOne({ where: { name } });
    if (existingFood) return res.status(400).json({ message: `Food with name '${name}' already exists` });

    // Upload video
    const uploadResult = await storageService.uploadFile(req.file.buffer, `food-video-${uuid()}`);

    // Create food
    const food = await Food.create({
      name,
      description,
      category,
      price,
      video: uploadResult.url,
      foodPartnerId: req.user.id, // Food partner
    });

    return res.status(201).json({ message: "Food created successfully", food });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: `Food with name '${req.body.name}' already exists` });
    }
    console.error("CREATE FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ================================== GET MY FOODS (Food Partner) =====================================
async function getMyFoods(req, res) {
  try {
    const foodItems = await Food.findAll({
      where: { foodPartnerId: req.user.id },
      include: [
        { model: User, as: "foodPartner", attributes: ["id", "fullName", "email"] }
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Your foods fetched successfully",
      count: foodItems.length,
      foodItems,
    });
  } catch (error) {
    console.error("GET MY FOODS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ================================ GET ALL FOODS (For Users) =======================================
async function getAllFoods(req, res) {
  try {
    const foods = await Food.findAll({
      include: [
        { model: User, as: "foodPartner", attributes: ["id", "fullName", "email"] }
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ message: "Food items fetched", count: foods.length, foods });
  } catch (error) {
    console.error("GET ALL FOODS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//================================== LIKE FOOD =======================================
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

//============================================ SAVE FOOD ============================================
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

//========================================= GET SAVED FOOD ============================================
async function getSaveFood(req, res) {
  try {
    const userId = req.user.id;

    const savedFoods = await Save.findAll({
      where: { userId },
      include: [
        {
          model: Food,
          include: [{ model: User, as: "foodPartner", attributes: ["id", "fullName"] }],
        },
      ],
    });

    return res.status(200).json({ message: "Saved foods fetched", savedFoods });
  } catch (error) {
    console.error("GET SAVED FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//====================================== SEARCH FOOD =================================================
const searchFoods = async (req, res) => {
  try {
    const { query, category, partner } = req.query;

    const foodWhere = {};
    // Text search on food name (partial + case-insensitive + basic fuzzy)
    if (query) {
      foodWhere[Op.or] = [
        ciLike("name", query), // food name
        Sequelize.where(       // basic fuzzy match
          Sequelize.fn("SOUNDEX", Sequelize.col("name")),
          Sequelize.fn("SOUNDEX", query)
        ),
      ];
    }

    // Category filter
    if (category) {
      foodWhere.category = ciLike("category", category);
    }

    // Include foodPartner join
    const include = [
      {
        model: User,
        as: "foodPartner",
        attributes: ["id", "fullName", "email"],
        ...(partner ? { where: ciLike("fullName", partner) } : {}),
      },
    ];

    const foods = await Food.findAll({
      where: foodWhere,
      include,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Search results fetched successfully",
      count: foods.length,
      foods,
    });
  } catch (error) {
    console.error("SEARCH FOOD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createFood,
  getMyFoods,
  getAllFoods,
  likeFood,
  saveFood,
  getSaveFood,
  searchFoods,
};