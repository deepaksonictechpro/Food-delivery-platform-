const deliveryPartnerService = require("../services/delivery_partner.services");


// ================= GET PROFILE =================

async function getDeliveryPartnerProfile(req, res) {
  try {

    const partnerId = req.user.id;

    const partner = await deliveryPartnerService.getDeliveryPartnerProfile(partnerId);

    return res.status(200).json({
      success: true,
      message: "Delivery partner profile fetched successfully",
      data: partner
    });

  } catch (error) {
    console.error("GET DELIVERY PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// ================= UPDATE PROFILE =================

async function updateDeliveryPartnerProfile(req, res) {
  try {

    const partnerId = req.user.id;

    const data = {
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      vehicleType: req.body.vehicleType,
      vehicleNumber: req.body.vehicleNumber,
      drivingLicenseNumber: req.body.drivingLicenseNumber
    };

    if (req.file) {
      data.profileImage = req.file.path;
    }

    const partner = await deliveryPartnerService.updateDeliveryPartnerProfile(partnerId, data);

    return res.status(200).json({
      success: true,
      message: "Delivery partner profile updated successfully",
      data: partner
    });

  } catch (error) {
    console.error("UPDATE DELIVERY PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getDeliveryPartnerProfile,
  updateDeliveryPartnerProfile
};