const { User, Food } = require("../models");

//================================= Get Food Partner By ID  =====================================

async function getFoodPartnerById(req, res) {
  try {
    const id = req.params.id;

    const fp = await User.findOne({ where: { id, role: "food_partner" } });
    if (!fp) return res.status(404).json({ message: "Food partner not found" });

    const foods = await Food.findAll({ where: { foodPartnerId: id } });

    res.status(200).json({
      message: "Food partner retrieved successfully",
      foodPartner: { ...fp.toJSON(), foods },
    });
  } catch (error) {
    console.error("GET FOOD PARTNER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getFoodPartnerById };
