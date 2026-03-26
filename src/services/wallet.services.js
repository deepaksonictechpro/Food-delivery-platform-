const { Wallet, WalletTransaction } = require("../models");
const { getPagination, getPagingData } = require("../utils/pagination.utility");

// Get Wallet
async function getWalletService(userId) {
  let wallet = await Wallet.findOne({
    where: { userId },
    attributes: ["id", "balance", "status"],
  });

  // Auto create wallet
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
    });
  }

  return wallet;
}

// Get Transactions
async function getWalletTransactionsService({ userId, page, limit }) {
  const { limit: pageSize, offset } = getPagination(page, limit);

  const wallet = await Wallet.findOne({ where: { userId } });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const data = await WalletTransaction.findAndCountAll({
    where: { walletId: wallet.id },
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset,
  });

  return getPagingData(data, page, limit);
}

module.exports = {
  getWalletService,
  getWalletTransactionsService,
};