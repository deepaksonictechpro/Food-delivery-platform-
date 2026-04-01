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

  // Strong duplicate check
  const existing = await DeliveryPartnerWallet.findOne({
    where: {
      deliveryPartnerId,
      referenceId: orderId,
      transactionType: "delivery_earning",
    },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });

  if (existing) {
    throw new Error("Earning already added for this order");
  }

  //  Lock last transaction row
  const lastTxn = await DeliveryPartnerWallet.findOne({
    where: { deliveryPartnerId },
    order: [["createdAt", "DESC"]],
    transaction: t,
    lock: t.LOCK.UPDATE,
  });

  const lastBalance = lastTxn ? parseFloat(lastTxn.balanceAfterTransaction) : 0;

  const amount = parseFloat(PER_DELIVERY_EARNING);
  const newBalance = lastBalance + amount;

  await DeliveryPartnerWallet.create(
    {
      deliveryPartnerId,
      amount,
      type: "credit",
      transactionType: "delivery_earning",
      referenceId: orderId,
      balanceAfterTransaction: newBalance,
      status: "success",
    },
    { transaction: t }
  );

  return {
    added: amount,
    balance: newBalance,
  };
}

module.exports = {
  getPartnerWalletService,
  getPartnerTransactionsService,
  addEarningToWallet,
};