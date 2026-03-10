const foodPartnerService = require("../services/food-partner.services");

//------------------------------- GET FOOD PARTNER BY ID --------------------------------------

async function getFoodPartnerById(req, res) {
  try {
    const id = req.params.id;
    const foodPartner = await foodPartnerService.fetchFoodPartnerById(id);

    if (!foodPartner) {
      return res.status(404).json({ message: "Food partner not found" });
    }

    res.status(200).json({
      message: "Food partner retrieved successfully",
      foodPartner,
    });
  } catch (error) {
    console.error("GET FOOD PARTNER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getFoodPartnerById };