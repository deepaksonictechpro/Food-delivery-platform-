const { Wallet, WalletTransaction, DeliveryOrder  } = require("../models");
const { getPagination, getPagingData } = require("../utils/pagination.utility");
const {sequelize} = require("../config/database"); // adjust path if needed

// ------------------------- Get Wallet ----------------------------

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

// -----------------------Get Transactions-------------------------------

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

// ----------------------- Add Money -------------------------

async function addMoneyService(userId, amount) {
  return await sequelize.transaction(async (t) => {
    // Find or create wallet
    let wallet = await Wallet.findOne({ where: { userId }, transaction: t });

    if (!wallet) {
      wallet = await Wallet.create(
        { userId, balance: 0 },
        { transaction: t }
      );
    }
    //  Update balance
    const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
    await wallet.update({ balance: newBalance }, { transaction: t });

    // Create transaction
    await WalletTransaction.create(
      {
        walletId: wallet.id,
        userId,
        type: "credit",
        amount,
        transactionType: "add_money",
        balanceAfterTransaction: newBalance,
        status: "success",
      },
      { transaction: t }
    );

    return {
      balance: newBalance,
    };
  });
}

//------------------------- Pay With Wallet -------------------------

async function payWithWalletService(userId, _amount, orderId) {
  return await sequelize.transaction(async (t) => {
    const order = await DeliveryOrder.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Order not found");
    if (order.userId !== userId) throw new Error("Unauthorized payment attempt");

    const amount = parseFloat(order.totalAmount);
    if (!amount || amount <= 0) {
      throw new Error("Invalid order total amount");
    }

    // Get wallet
    const wallet = await Wallet.findOne({
      where: { userId },
      transaction: t,
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Check balance
    if (parseFloat(wallet.balance) < amount) {
      throw new Error("Insufficient wallet balance");
    }

    // Deduct balance
    const newBalance = parseFloat(wallet.balance) - amount;

    await wallet.update(
      { balance: newBalance },
      { transaction: t }
    );

    // Create transaction
    await WalletTransaction.create(
      {
        walletId: wallet.id,
        userId,
        type: "debit",
        amount,
        transactionType: "order_payment",
        referenceId: orderId,
        balanceAfterTransaction: newBalance,
        status: "success",
      },
      { transaction: t }
    );

    // update order status
    await DeliveryOrder.update(
      { paymentStatus: "paid" },
      { where: { id: orderId }, transaction: t }
    );

    return {
      balance: newBalance,
    };
  });
}

module.exports = {
  getWalletService,
  getWalletTransactionsService,
  addMoneyService,
  payWithWalletService,
};