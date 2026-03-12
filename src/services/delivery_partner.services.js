const { User } = require("../models");

// ================= GET DELIVERY PARTNER PROFILE =================

async function getDeliveryPartnerProfile(partnerId) {
  const partner = await User.findOne({
    where: {
      id: partnerId,
      role: "delivery_partner",
    },
    attributes: [
      "id",
      "fullName",
      "email",
      "profileImage",
      "status",
      "vehicleType",
      "vehicleNumber",
      "drivingLicenseNumber",
      "totalDeliveries",
      "earnings"
    ],
  });

  if (!partner) {
    throw new Error("Delivery partner not found");
  }

  return partner;
}


// ================= UPDATE DELIVERY PARTNER PROFILE =================

async function updateDeliveryPartnerProfile(partnerId, data) {

  const partner = await User.findOne({
    where: {
      id: partnerId,
      role: "delivery_partner"
    }
  });

  if (!partner) {
    throw new Error("Delivery partner not found");
  }

  await partner.update(data);

  return {
    id: partner.id,
    fullName: partner.fullName,
    email: partner.email,
    profileImage: partner.profileImage,
    status: partner.status,
    vehicleType: partner.vehicleType,
    vehicleNumber: partner.vehicleNumber,
    drivingLicenseNumber: partner.drivingLicenseNumber,
    totalDeliveries: partner.totalDeliveries,
    earnings: partner.earnings
  };
}

module.exports = {
  getDeliveryPartnerProfile,
  updateDeliveryPartnerProfile
};