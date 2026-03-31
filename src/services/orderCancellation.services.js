const { DeliveryOrder, User, Food } = require("../models");
const { sequelize } = require("../config/database");
const { refundToWalletService } = require("./wallet.services");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");

//------------------------------- REQUEST CANCEL ORDER --------------------------------------

const requestCancelOrderService = async (userId, orderId, reason) => {
  const order = await DeliveryOrder.findByPk(orderId);
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("You cannot cancel this order");
  if ([ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(order.status))
    throw new Error("Cannot cancel this order");

  order.previousStatus = order.status;
  order.status = ORDER_STATUS.CANCEL_REQUESTED;
  order.cancelReason = reason;
  order.cancelRequestedAt = new Date();

  await order.save();
  return order;
};

//------------------------------- ADMIN CANCEL DECISION --------------------------------------

const handleCancelDecisionService = async (adminId, orderId, decision, adminReason) => {
  return await sequelize.transaction(async (t) => {

    const order = await DeliveryOrder.findByPk(orderId, { transaction: t });

    if (!order) throw new Error("Order not found");
    if (order.status !== ORDER_STATUS.CANCEL_REQUESTED) {
      throw new Error("No cancel request found");
    }

    order.cancelApprovedBy = adminId;
    order.cancelApprovedAt = new Date();
    order.cancelDecisionReason = adminReason;

    // ---------------- APPROVE ----------------
    if (decision === "approve") {

      order.status = ORDER_STATUS.CANCELLED;

      await order.save({ transaction: t });

      // 🔥 FIX: PASS SAME TRANSACTION
      await refundToWalletService(order.userId, order.id, t);

    }

    // ---------------- REJECT ----------------
    else if (decision === "reject") {

      order.status = order.previousStatus;

      await order.save({ transaction: t });

    }

    else {
      throw new Error("Invalid decision");
    }

    return order;
  });
};

//------------------------------- ADMIN: GET PENDING CANCEL REQUESTS --------------------------------------

const getPendingCancelRequestsService = async () => {
  const orders = await DeliveryOrder.findAll({
    where: { status: ORDER_STATUS.CANCEL_REQUESTED },
    include: [
      { model: User, as: "user", attributes: ["id", "fullName", "email"] },
      { model: Food, as: "food", attributes: ["id", "name", "price"] },
    ],
    order: [["cancelRequestedAt", "DESC"]],
  });
  return orders;
};

module.exports = {
  requestCancelOrderService,
  handleCancelDecisionService,
  getPendingCancelRequestsService,
};