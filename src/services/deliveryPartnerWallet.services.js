const { DeliveryPartnerWallet } = require("../models");
const { PER_DELIVERY_EARNING } = require("../constants/delivery.constants");

// ---------------- GET WALLET BALANCE ----------------
async function getPartnerWalletService(deliveryPartnerId) {
  const lastTxn = await DeliveryPartnerWallet.findOne({
    where: { deliveryPartnerId },
    order: [["createdAt", "DESC"]],
  });

  return {
    balance: lastTxn ? lastTxn.balanceAfterTransaction : 0,
  };
}

// ---------------- GET TRANSACTIONS ----------------
async function getPartnerTransactionsService(deliveryPartnerId) {
  return await DeliveryPartnerWallet.findAll({
    where: { deliveryPartnerId },
    order: [["createdAt", "DESC"]],
  });
}

// ---------------- ADD EARNING (USED IN DELIVERY FLOW) ----------------
async function addEarningToWallet(deliveryPartnerId, orderId, t) {

  const existing = await DeliveryPartnerWallet.findOne({
    where: {
      deliveryPartnerId,
      referenceId: orderId,
      transactionType: "delivery_earning",
    },
    transaction: t,
  });

  if (existing) return;

  const lastTxn = await DeliveryPartnerWallet.findOne({
    where: { deliveryPartnerId },
    order: [["createdAt", "DESC"]],
    transaction: t,
  });

  const lastBalance = lastTxn ? lastTxn.balanceAfterTransaction : 0;
  const newBalance = lastBalance + PER_DELIVERY_EARNING;

  await DeliveryPartnerWallet.create(
    {
      deliveryPartnerId,
      amount: PER_DELIVERY_EARNING,
      type: "credit",
      transactionType: "delivery_earning",
      referenceId: orderId,
      balanceAfterTransaction: newBalance,
      status: "success",
    },
    { transaction: t }
  );
}

module.exports = {
  getPartnerWalletService,
  getPartnerTransactionsService,
  addEarningToWallet,
};