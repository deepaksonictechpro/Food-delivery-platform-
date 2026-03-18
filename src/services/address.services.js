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
  const address = await Address.findOne({
    where: { id: addressId, userId },
  });

  if (!address) throw new Error("Address not found");

  if (data.label !== undefined) address.label = data.label;

  if (data.address !== undefined) {
    if (!data.address || !data.address.trim()) {
      throw new Error("Address cannot be empty");
    }
    address.address = data.address.trim();
  }

  if (data.city !== undefined) address.city = data.city;
  if (data.state !== undefined) address.state = data.state;
  if (data.zipCode !== undefined) address.zipCode = data.zipCode;

  if (data.phoneNumber !== undefined) {
    if (!data.phoneNumber.trim()) {
      throw new Error("Phone number cannot be empty");
    }
    address.phoneNumber = data.phoneNumber;
  }

  if (data.doorImage !== undefined) {
    address.doorImage = data.doorImage;
  }

  await address.save();

  return address;
}
//------------------------------- DELETE ADDRESS --------------------------------------
async function deleteAddressService(userId, addressId) {
  const address = await Address.findOne({
    where: { id: addressId, userId },
  });

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