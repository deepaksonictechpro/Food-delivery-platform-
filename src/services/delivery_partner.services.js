const { User } = require("../models");


// ================= GET DELIVERY PARTNER PROFILE =================

async function getDeliveryPartnerProfile(userId) {
  const user = await User.findByPk(userId);

  if (!user || user.role !== "delivery_partner") {
    throw new Error("Delivery partner not found");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    role: user.role,

    vehicleType: user.vehicleType,
    vehicleNumber: user.vehicleNumber,
    drivingLicenseNumber: user.drivingLicenseNumber,
    totalDeliveries: user.totalDeliveries,
    earnings: user.earnings,

    status: user.status,
    isOtpVerified: user.isOtpVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}


// ================= UPDATE DELIVERY PARTNER PROFILE =================

async function updateDeliveryPartnerProfile(userId, data) {
  const user = await User.findByPk(userId);

  if (!user || user.role !== "delivery_partner") {
    throw new Error("Delivery partner not found");
  }

  const updates = {};

  if (data.fullName !== undefined) updates.fullName = data.fullName;
  if (data.phoneNumber !== undefined) updates.phoneNumber = data.phoneNumber;
  if (data.profileImage !== undefined) updates.profileImage = data.profileImage;

  if (data.vehicleType !== undefined) updates.vehicleType = data.vehicleType;
  if (data.vehicleNumber !== undefined) updates.vehicleNumber = data.vehicleNumber;
  if (data.drivingLicenseNumber !== undefined)
    updates.drivingLicenseNumber = data.drivingLicenseNumber;

  await user.update(updates);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    role: user.role,

    vehicleType: user.vehicleType,
    vehicleNumber: user.vehicleNumber,
    drivingLicenseNumber: user.drivingLicenseNumber,
    totalDeliveries: user.totalDeliveries,
    earnings: user.earnings,

    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}


module.exports = {
  getDeliveryPartnerProfile,
  updateDeliveryPartnerProfile
};
