const foodPartnerService = require("../services/food-partner.services");

// ==== get Food Partner By Id =====
async function getFoodPartnerById(req, res) {
  try {
    const id = req.params.id;
    const foodPartner = await foodPartnerService.fetchFoodPartnerById(id);

    if (!foodPartner) return res.status(404).json({ message: "Food partner not found" });

    res.status(200).json({ message: "Food partner retrieved successfully", foodPartner });
  } catch (error) {
    console.error("GET FOOD PARTNER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ===== Food Partner Profile =====
async function getFoodPartnerProfile(req, res) {
  try {
    const id = req.user.id;
    let partner = await foodPartnerService.fetchFoodPartnerProfile(id);

    const host = req.protocol + "://" + req.get("host");
    partner.profileImage = partner.profileImage ? host + "/" + partner.profileImage : null;

    return res.status(200).json({
      success: true,
      message: "Food Partner profile fetched successfully",
      data: partner
    });
  } catch (error) {
    console.error("GET FOOD PARTNER PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// ===== Update Food Partner Profile =====

async function updateFoodPartnerProfile(req, res) {
  try {
    const id = req.user.id;
    const data = { ...req.body };

    if (req.file) data.profileImage = req.file.path;

    let partner = await foodPartnerService.updateFoodPartnerProfile(id, data);

    const host = req.protocol + "://" + req.get("host");
    partner.profileImage = partner.profileImage ? host + "/" + partner.profileImage : null;

    return res.status(200).json({
      success: true,
      message: "Food Partner profile updated successfully",
      data: partner
    });
  } catch (error) {
    console.error("UPDATE FOOD PARTNER PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getFoodPartnerById,
  getFoodPartnerProfile,
  updateFoodPartnerProfile
};