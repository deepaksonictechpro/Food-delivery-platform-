const { DeliveryOrder, User, Food } = require("../models");

//------------------------------- REQUEST CANCEL ORDER --------------------------------------

const requestCancelOrderService = async (userId, orderId, reason) => {
  const order = await DeliveryOrder.findByPk(orderId);
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("You cannot cancel this order");
  if (["delivered", "cancelled"].includes(order.status))
    throw new Error("Cannot cancel this order");

  order.previousStatus = order.status;
  order.status = "cancel_requested";
  order.cancelReason = reason;
  order.cancelRequestedAt = new Date();

  await order.save();
  return order;
};

//------------------------------- ADMIN CANCEL DECISION --------------------------------------

const handleCancelDecisionService = async (adminId, orderId, decision, adminReason) => {
  const order = await DeliveryOrder.findByPk(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "cancel_requested") throw new Error("No cancel request found");

  order.cancelApprovedBy = adminId;
  order.cancelApprovedAt = new Date();
  order.cancelDecisionReason = adminReason;
  order.status = decision === "approve" ? "cancelled" : order.previousStatus;

  await order.save();
  return order;
};

//------------------------------- ADMIN: GET PENDING CANCEL REQUESTS --------------------------------------

const getPendingCancelRequestsService = async () => {
  const orders = await DeliveryOrder.findAll({
    where: { status: "cancel_requested" },
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