const foodService = require("../services/food.services");
const { getFoodOrdersService } = require("../services/food-partner.services");

//------------------------------------ CREATE FOOD ----------------------------------------------

async function createFood(req, res) {
  try {
    const food = await foodService.createFoodService({ 
      ...req.body, 
      file: req.file, 
      foodPartnerId: req.user.id 
    });
    res.status(201).json({ message: "Food created successfully", food });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//------------------------------- GET MY FOODS ----------------------------------------------

async function getMyFoods(req, res) {
  try {
    const foods = await foodService.getMyFoodsService(req.user.id);
    res.status(200).json({ message: "Your foods fetched successfully", count: foods.length, foodItems: foods });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//------------------------------- GET ALL FOODS ----------------------------------------------

async function getAllFoods(req, res) {
  try {
    const foods = await foodService.getAllFoodsService();
    res.status(200).json({ message: "Food items fetched", count: foods.length, foods });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//------------------------------- LIKE/UNLIKE FOOD ----------------------------------------------

async function likeFood(req, res) {
  try {
    const result = await foodService.likeFoodService({ userId: req.user.id, foodId: req.body.foodId });
    res.status(result.message.includes("unliked") ? 200 : 201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//------------------------------- SAVE/UNSAVE FOOD ----------------------------------------------

async function saveFood(req, res) {
  try {
    const result = await foodService.saveFoodService({ userId: req.user.id, foodId: req.body.foodId });
    res.status(result.message.includes("unsaved") ? 200 : 201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//------------------------------- GET SAVED FOODS ----------------------------------------------

async function getSavedFoods(req, res) {
  try {
    const savedFoods = await foodService.getSavedFoodsService(req.user.id);
    res.status(200).json({ message: "Saved foods fetched", savedFoods });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//------------------------------- SEARCH FOODS ----------------------------------------------

async function searchFoods(req, res) {
  try {
    const foods = await foodService.searchFoodsService(req.query);
    res.status(200).json({ message: "Search results fetched successfully", count: foods.length, foods });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


//------------------------------- UPDATE FOOD ----------------------------------------------
async function updateFood(req, res) {
  try {
    const foodId = req.params.id;
    const updatedFood = await foodService.updateFoodService(foodId, req.user.id, req.body, req.file);
    res.status(200).json({ message: "Food updated successfully", food: updatedFood });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//------------------------------- DELETE FOOD ----------------------------------------------
async function deleteFood(req, res) {
  try {
    const foodId = req.params.id;
    await foodService.deleteFoodService(foodId, req.user.id);
    res.status(200).json({ message: "Food deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//------------------------------- GET FOOD ORDERS --------------------------------------
async function getFoodOrders(req, res) {
  try {
    const orders = await getFoodOrdersService(req.user.id);
    res.status(200).json({ message: "Food orders fetched successfully", count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createFood,
  getMyFoods,
  getAllFoods,
  likeFood,
  saveFood,
  getSavedFoods,
  searchFoods,
  updateFood,
  deleteFood,
  getFoodOrders,
};
