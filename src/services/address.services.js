const { Address } = require("../models");

// ================= Add New Address =================
async function addAddressService(userId, data) {
  const address = await Address.create({ ...data, userId });
  return address;
}

// ================= Get All User Addresses =================
async function getUserAddressesService(userId) {
  return Address.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
}

// ================= Update Address =================
async function updateAddressService(userId, addressId, data) {
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) throw new Error("Address not found");

  Object.assign(address, data);
  await address.save();
  return address;
}

// ================= Delete Address =================
async function deleteAddressService(userId, addressId) {
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) throw new Error("Address not found");

  await address.destroy();
  return { message: "Address deleted successfully" };
}

module.exports = {
  addAddressService,
  getUserAddressesService,
  updateAddressService,
  deleteAddressService,
};