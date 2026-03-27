const walletService = require("../services/deliveryPartnerWallet.services");

// ---------------- GET WALLET ----------------
const getWallet = async (req, res) => {
  try {
    const data = await walletService.getPartnerWalletService(req.user.id);

    res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      data,
    });
  } catch (err) {
    console.error("GET WALLET ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ---------------- GET TRANSACTIONS ----------------
const getTransactions = async (req, res) => {
  try {
    const data = await walletService.getPartnerTransactionsService(req.user.id);

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data,
    });
  } catch (err) {
    console.error("GET TRANSACTIONS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getWallet,
  getTransactions,
};