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
    res.status(201).json({
      success: true,
      message: "Food created successfully",
      data: food
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//------------------------------- GET MY FOODS ----------------------------------------------

async function getMyFoods(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await foodService.getMyFoodsService({
      foodPartnerId: req.user.id,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Your foods fetched successfully",
      data: result,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

//------------------------------- GET ALL FOODS ----------------------------------------------

async function getAllFoods(req, res) {
  try {
    const result = await foodService.getAllFoodsService(req.query);

    res.status(200).json({
      message: "Filtered food items fetched",
      ...result,
    });
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
    const { page = 1, limit = 10 } = req.query;

    const result = await foodService.getSavedFoodsService({
      userId: req.user.id,
      page,
      limit,
    });

    return res.status(200).json({
      message: "Saved foods fetched",
      ...result,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch foods"
    });
  }
}

//------------------------------- SEARCH FOODS ----------------------------------------------

async function searchFoods(req, res) {
  try {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" } = req.query;

    const result = await foodService.searchFoodsService({
      ...req.query,
      page: Number(page),
      limit: Number(limit),
      sortBy,
      order,
    });

    res.status(200).json({
      message: "Search results fetched successfully",
      ...result,
    });
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
    res.status(400).json({
      success: false,
      message: err.message
    });
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


//------------------------------- ADD SAVED ITEM TO CART ----------------------------------------------

async function addSavedToCart(req, res) {
  try {
    const result = await foodService.addSavedToCartService({
      userId: req.user.id,
      foodId: req.body.foodId,
    });

    res.status(200).json({
      message: "Item added to cart from wishlist",
      result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
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
  addSavedToCart,
};
