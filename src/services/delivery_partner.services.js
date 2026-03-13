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
      "phoneNumber",
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

  await partner.update({
    fullName: data.fullName || partner.fullName,
    phoneNumber: data.phoneNumber || partner.phoneNumber,
    profileImage: data.profileImage || partner.profileImage,
    vehicleType: data.vehicleType || partner.vehicleType,
    vehicleNumber: data.vehicleNumber || partner.vehicleNumber,
    drivingLicenseNumber: data.drivingLicenseNumber || partner.drivingLicenseNumber,
    totalDeliveries: data.totalDeliveries || partner.totalDeliveries,
    earnings: data.earnings || partner.earnings
  });

  return {
    id: partner.id,
    fullName: partner.fullName,
    email: partner.email,
    phoneNumber: partner.phoneNumber,
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