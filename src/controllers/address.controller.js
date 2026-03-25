const addressService = require("../services/address.services");
const { deleteFile } = require("../utils/fileHandler");

// --------------------------------- Add new address -------------------------------------

async function addAddress(req, res) {
  const uploadedFilePath = req.file ? req.file.path : null;

  try {
    const address = await addressService.addAddressService(
      req.user.id,
      {
        ...req.body,
        doorImage: uploadedFilePath,
      }
    );

    res.status(201).json({
      success: true,
      message: "Address added",
      data: address
    });

  } catch (err) {
    deleteFile(uploadedFilePath);

    console.error("ADD ADDRESS ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}
// --------------------------------- Get User Addresses -------------------------------------

async function getUserAddresses(req, res) {
  try {
    const addresses = await addressService.getUserAddressesService(req.user.id);
    res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully",
      data: {
        count: addresses.length,
        addresses
      }
    });
  } catch (err) {
    console.error("GET ADDRESSES ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses"
    });
  }
}

// --------------------------------- Update Address -------------------------------------

async function updateAddress(req, res) {
  try {
    const address = await addressService.updateAddressService(
      req.user.id,
      req.params.id,
      req.body,
      req.file 
    );

    res.status(200).json({
      success: true,
      message: "Address updated",
      data: address
    });
  } catch (err) {
    console.error("UPDATE ADDRESS ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

//---------------------------------- Delete Address -------------------------------------

async function deleteAddress(req, res) {
  try {
    const result = await addressService.deleteAddressService(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
};