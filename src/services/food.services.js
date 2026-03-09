const { Food, User, Like, Save } = require("../models");
const storageService = require("./storage.service");
const { v4: uuid } = require("uuid");
const { Op, Sequelize } = require("sequelize");

// Helper: case-insensitive LIKE
const ciLike = (column, value) =>
  Sequelize.where(Sequelize.fn("LOWER", Sequelize.col(column)), { [Op.like]: `%${value.toLowerCase()}%` });

// ========================== CREATE FOOD ==========================
async function createFoodService({ name, description, category, price, file, foodPartnerId }) {
  if (!name) throw new Error("Food name is required");
  if (!category) throw new Error("Category is required");
  if (!price) throw new Error("Price is required");
  if (!file) throw new Error("Food video is required");

  const existingFood = await Food.findOne({ where: { name } });
  if (existingFood) throw new Error(`Food with name '${name}' already exists`);

  // Upload video
  const uploadResult = await storageService.uploadFile(file.buffer, `food-video-${uuid()}`);

  // Create food
  const food = await Food.create({
    name,
    description,
    category,
    price,
    video: uploadResult.url,
    foodPartnerId,
  });

  return food;
}

// ========================== GET MY FOODS ==========================
async function getMyFoodsService(foodPartnerId) {
  const foodItems = await Food.findAll({
    where: { foodPartnerId },
    include: [{ model: User, as: "foodPartner", attributes: ["id", "fullName", "email"] }],
    order: [["createdAt", "DESC"]],
  });
  return foodItems;
}

// ========================== GET ALL FOODS ==========================
async function getAllFoodsService() {
  const foods = await Food.findAll({
    include: [{ model: User, as: "foodPartner", attributes: ["id", "fullName", "email"] }],
    order: [["createdAt", "DESC"]],
  });
  return foods;
}

// ========================== LIKE FOOD ==========================
async function likeFoodService({ userId, foodId }) {
  if (!foodId) throw new Error("foodId is required");

  const existing = await Like.findOne({ where: { userId, foodId } });
  if (existing) {
    await existing.destroy();
    await Food.increment({ likeCount: -1 }, { where: { id: foodId } });
    return { message: "Food unliked" };
  }

  await Like.create({ userId, foodId });
  await Food.increment({ likeCount: 1 }, { where: { id: foodId } });
  return { message: "Food liked" };
}

// ========================== SAVE FOOD ==========================
async function saveFoodService({ userId, foodId }) {
  if (!foodId) throw new Error("foodId is required");

  const existing = await Save.findOne({ where: { userId, foodId } });
  if (existing) {
    await existing.destroy();
    await Food.increment({ savesCount: -1 }, { where: { id: foodId } });
    return { message: "Food unsaved" };
  }

  await Save.create({ userId, foodId });
  await Food.increment({ savesCount: 1 }, { where: { id: foodId } });
  return { message: "Food saved" };
}

// ========================== GET SAVED FOODS ==========================
async function getSavedFoodsService(userId) {
  const savedFoods = await Save.findAll({
    where: { userId },
    include: [
      {
        model: Food,
        include: [{ model: User, as: "foodPartner", attributes: ["id", "fullName"] }],
      },
    ],
  });
  return savedFoods;
}

// ========================== SEARCH FOODS ==========================
async function searchFoodsService({ query, category, partner }) {
  const foodWhere = {};

  if (query) {
    foodWhere[Op.or] = [
      ciLike("name", query),
      Sequelize.where(Sequelize.fn("SOUNDEX", Sequelize.col("name")), Sequelize.fn("SOUNDEX", query)),
    ];
  }

  if (category) {
    foodWhere.category = ciLike("category", category);
  }

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

  return foods;
}

// ===================== UPDATE FOOD =====================
async function updateFoodService(foodId, foodPartnerId, updateData, file) {
  const food = await Food.findOne({ where: { id: foodId, foodPartnerId } });
  if (!food) throw new Error("Food not found or you are not authorized");

  if (file) updateData.file = file;
  await food.update(updateData);
  return food;
}

// ===================== DELETE FOOD =====================
async function deleteFoodService(foodId, foodPartnerId) {
  const food = await Food.findOne({ where: { id: foodId, foodPartnerId } });
  if (!food) throw new Error("Food not found or you are not authorized");

  await food.destroy();
  return true;
}

module.exports = {
  createFoodService,
  getMyFoodsService,
  getAllFoodsService,
  likeFoodService,
  saveFoodService,
  getSavedFoodsService,
  searchFoodsService,
  updateFoodService,
  deleteFoodService,
};