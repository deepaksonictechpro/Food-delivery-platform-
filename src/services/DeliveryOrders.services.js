const { DeliveryOrder, Food, User } = require("../models");
const { PER_DELIVERY_EARNING } = require("../constants/delivery.constants");

//==================================== Place a new order ==========================================

async function placeOrderService(userId, foodId, quantity, address, paymentMethod) {
  const food = await Food.findByPk(foodId);
  if (!food) throw new Error("Food not found");

  const order = await DeliveryOrder.create({
    foodId,
    userId,
    quantity,
    address,
    paymentMethod,
    status: "pending",
    earning: 0,
  });

  return order;
}

//================================= Get orders of a specific user ===============================
 
async function getUserOrdersService(userId) {
  return DeliveryOrder.findAll({
    where: { userId },
    include: [{ model: Food, as: "food" }],
    order: [["createdAt", "DESC"]],
  });
}

//========================== Get all available orders for delivery partners ======================
 
async function getAvailableOrdersService() {
  return DeliveryOrder.findAll({
    where: { deliveryPartnerId: null, status: "pending" },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
  });
}

//=================================== Accept an order ====================================
 
async function acceptOrderService(orderId, deliveryPartnerId) {
  const order = await DeliveryOrder.findOne({
    where: { id: orderId, status: "pending", deliveryPartnerId: null },
  });
  if (!order) throw new Error("Order not found or already assigned");

  order.deliveryPartnerId = deliveryPartnerId;
  order.status = "picked";
  await order.save();

  return order;
}

//===================== Get all assigned deliveries for a delivery partner =======================
 
async function getAssignedDeliveriesService(deliveryPartnerId) {
  return DeliveryOrder.findAll({
    where: { deliveryPartnerId },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
    order: [["createdAt", "DESC"]],
  });
}

//===================== Update delivery status (and set earning if delivered) ======================
 
async function updateDeliveryStatusService(orderId, deliveryPartnerId, status) {
  if (!["picked", "delivered"].includes(status)) throw new Error("Invalid status");

  const order = await DeliveryOrder.findOne({
    where: { id: orderId, deliveryPartnerId },
  });
  if (!order) throw new Error("Order not found");

  order.status = status;
  if (status === "delivered") order.earning = PER_DELIVERY_EARNING;

  await order.save();
  return order;
}

module.exports = {
  placeOrderService,
  getUserOrdersService,
  getAvailableOrdersService,
  acceptOrderService,
  getAssignedDeliveriesService,
  updateDeliveryStatusService,
};