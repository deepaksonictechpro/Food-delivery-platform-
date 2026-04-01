const { Wallet, WalletTransaction, Order } = require("../models");
const { getPagination, getPagingData } = require("../utils/pagination.utility");
const { sequelize } = require("../config/database");

// ------------------------- Get Wallet ----------------------------

async function getWalletService(userId) {
  let wallet = await Wallet.findOne({
    where: { userId },
    attributes: ["id", "balance", "status"],
  });

  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
    });
  }

  return wallet;
}

// ----------------------- Get Transactions -------------------------------

async function getWalletTransactionsService({ userId, page, limit }) {
  const { limit: pageSize, offset } = getPagination(page, limit);

  const wallet = await Wallet.findOne({ where: { userId } });

  if (!wallet) throw new Error("Wallet not found");

  const data = await WalletTransaction.findAndCountAll({
    where: { walletId: wallet.id },
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset,
  });

  return getPagingData(data, page, limit);
}

// ----------------------- Add Money (SECURE FIX) -------------------------

async function addMoneyService(userId, amount) {
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    throw new Error("Invalid amount");
  }

  return await sequelize.transaction(async (t) => {
    let wallet = await Wallet.findOne({
      where: { userId },
      transaction: t,
    });

    if (!wallet) {
      wallet = await Wallet.create(
        { userId, balance: 0 },
        { transaction: t }
      );
    }

    const newBalance =
      parseFloat(wallet.balance) + parseFloat(amount);

    await wallet.update(
      { balance: newBalance },
      { transaction: t }
    );

    await WalletTransaction.create(
      {
        walletId: wallet.id,
        userId,
        type: "credit",
        amount,
        transactionType: "test_topup",
        balanceAfterTransaction: newBalance,
        status: "success",
      },
      { transaction: t }
    );

    return {
      success: true,
      message: "Money added to wallet (TEST MODE)",
      balance: newBalance,
    };
  });
}
// ------------------------- Pay With Wallet (FIXED + LOCK) -------------------------

const payWithWalletService = async (userId, orderId) => {
  return await sequelize.transaction(async (t) => {
    const order = await Order.findByPk(orderId, {
      transaction: t,
      lock: t.LOCK.UPDATE, 
    });

    if (!order) throw new Error("Order not found");

    if (order.userId !== userId) {
      throw new Error("Unauthorized: You cannot pay for this order");
    }

    if (order.paymentStatus === "PAID") {
      throw new Error("Order already paid");
    }

    if (order.status === "CANCELLED") {
      throw new Error("Cannot pay for cancelled order");
    }

    if (order.paymentMethod !== "WALLET") {
      throw new Error("Invalid payment method for wallet payment");
    }

    const wallet = await Wallet.findOne({
      where: { userId },
      transaction: t,
      lock: t.LOCK.UPDATE, //  lock wallet
    });

    if (!wallet || parseFloat(wallet.balance) < parseFloat(order.totalAmount)) {
      throw new Error("Insufficient wallet balance");
    }

    const newBalance =
      parseFloat(wallet.balance) - parseFloat(order.totalAmount);

    await wallet.update({ balance: newBalance }, { transaction: t });

    await order.update(
      {
        paymentStatus: "PAID",
      },
      { transaction: t }
    );

    await WalletTransaction.create(
      {
        walletId: wallet.id,
        userId,
        type: "debit",
        amount: order.totalAmount,
        transactionType: "order_payment",
        referenceId: order.id,
        balanceAfterTransaction: newBalance,
        status: "success",
      },
      { transaction: t }
    );

    return order;
  });
};

// ----------------------- Refund to Wallet (FIXED + SAFE) -------------------------

async function refundToWalletService(userId, orderId, t) {
  const order = await Order.findByPk(orderId, {
    transaction: t,
    lock: t.LOCK.UPDATE, // prevent duplicate refund
  });

  if (!order) throw new Error("Order not found");

  if (order.userId !== userId) {
    throw new Error("Unauthorized refund");
  }

  if (order.status !== "CANCELLED") {
    throw new Error("Refund allowed only for cancelled orders");
  }

  if (order.paymentStatus !== "PAID") {
    throw new Error("Refund not allowed for unpaid orders");
  }

  if (order.paymentMethod === "COD") {
    throw new Error("Refund not allowed for COD orders");
  }

  const existingRefund = await WalletTransaction.findOne({
    where: {
      userId,
      referenceId: orderId,
      transactionType: "refund",
    },
    transaction: t,
  });

  if (existingRefund) {
    throw new Error("Refund already processed for this order");
  }

  const amount = parseFloat(order.totalAmount);

  let wallet = await Wallet.findOne({
    where: { userId },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });

  if (!wallet) {
    wallet = await Wallet.create(
      { userId, balance: 0 },
      { transaction: t }
    );
  }

  const newBalance = parseFloat(wallet.balance) + amount;

  await wallet.update({ balance: newBalance }, { transaction: t });

  await WalletTransaction.create(
    {
      walletId: wallet.id,
      userId,
      type: "credit",
      amount,
      transactionType: "refund",
      referenceId: orderId,
      balanceAfterTransaction: newBalance,
      status: "success",
    },
    { transaction: t }
  );

  return {
    refundedAmount: amount,
    balance: newBalance,
  };
}

module.exports = {
  getWalletService,
  getWalletTransactionsService,
  addMoneyService,
  payWithWalletService,
  refundToWalletService,
};