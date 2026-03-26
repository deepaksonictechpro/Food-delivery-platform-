const walletService = require("../services/wallet.services");

// ----------------------- Get Wallet -------------------------

async function getWallet(req, res) {
  try {
    const result = await walletService.getWalletService(req.user.id);

    return res.status(200).json({
      message: "Wallet fetched successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// ----------------------- Get Transactions -------------------------

async function getWalletTransactions(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await walletService.getWalletTransactionsService({
      userId: req.user.id,
      page,
      limit,
    });

    return res.status(200).json({
      message: "Wallet transactions fetched",
      ...result,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

//----------------------- Add Money -------------------------
async function addMoney(req, res) {
  try {
    const { amount } = req.body;

    const result = await walletService.addMoneyService(
      req.user.id,
      amount
    );

    return res.status(200).json({
      message: "Money added successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

//----------------------- Pay with Wallet -------------------------

async function payWithWallet(req, res) {
  try {
    const { orderId } = req.body;

    const result = await walletService.payWithWalletService(
      req.user.id,
      null,
      orderId
    );

    return res.status(200).json({
      message: "Payment successful via wallet",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getWallet,
  getWalletTransactions,
  addMoney,
  payWithWallet,
};