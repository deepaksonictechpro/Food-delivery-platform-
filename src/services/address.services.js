const { Address } = require("../models");

//--------------------------------- ADD NEW ADDRESS --------------------------------------
async function addAddressService(userId, data) {
  const address = await Address.create({ ...data, userId });
  return address;
}

//------------------------------- GET USER ADDRESSES --------------------------------------
async function getUserAddressesService(userId) {
  return Address.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
}

//------------------------------- UPDATE ADDRESS --------------------------------------
async function updateAddressService(userId, addressId, data) {
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) throw new Error("Address not found");

  Object.assign(address, data);
  await address.save();
  return address;
}

//------------------------------- DELETE ADDRESS --------------------------------------
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