// src/services/DeliveryOrders.services.js
const { DeliveryOrder, Food, User } = require("../models");
const { PER_DELIVERY_EARNING } = require("../constants/delivery.constants");
const { removeFromCartService } = require("./cart.services");

//------------------------------- CLEAN ORDER RESPONSE --------------------------------------

function cleanOrderResponse(order) {
  const response = {
    id: order.id,
    foodId: order.foodId,
    quantity: order.quantity,
    address: order.address,
    status: order.status,
    paymentMethod: order.paymentMethod,
    deliveryPartnerId: order.deliveryPartnerId,
    earning: order.earning,
    food: order.food
      ? {
          id: order.food.id,
          name: order.food.name,
          description: order.food.description,
          category: order.food.category,
          price: order.food.price,
          video: order.food.video,
        }
      : undefined,
    user: order.user ? { id: order.user.id, fullName: order.user.fullName } : undefined,
  };

  // Include cancel info only if a cancellation was requested
  if (order.cancelRequestedAt) {
    response.cancelReason = order.cancelReason;
    response.cancelRequestedAt = order.cancelRequestedAt;
    response.cancelApprovedBy = order.cancelApprovedBy;
    response.cancelApprovedAt = order.cancelApprovedAt;
    response.cancelDecisionReason = order.cancelDecisionReason;
    response.previousStatus = order.previousStatus;
  }

  return response;
}

//------------------------------- PLACE ORDER SERVICE --------------------------------------

async function placeOrderService(userId, cartItems, address, paymentMethod) {
  if (!cartItems || !cartItems.length) throw new Error("Cart is empty");

  const orders = [];

  for (const item of cartItems) {
    if (!item.foodId) throw new Error("Cart item missing foodId");

    const order = await DeliveryOrder.create({
      foodId: item.foodId,
      userId,
      quantity: item.quantity,
      address,
      paymentMethod,
      status: "pending",
      earning: 0,
    });

    const createdOrder = await DeliveryOrder.findByPk(order.id, {
      include: [{ model: Food, as: "food" }],
    });

    orders.push(cleanOrderResponse(createdOrder));

    // Remove item from cart after creating order
    await removeFromCartService(userId, item.foodId);
  }

  return orders;
}

// ------------------------------- GET USER ORDERS SERVICE --------------------------------------

async function getUserOrdersService(userId) {
  const orders = await DeliveryOrder.findAll({
    where: { userId },
    include: [{ model: Food, as: "food" }],
    order: [["createdAt", "DESC"]],
  });

  return orders.map(cleanOrderResponse);
}

// ------------------------------- GET AVAILABLE ORDERS SERVICE --------------------------------------

async function getAvailableOrdersService() {
  const orders = await DeliveryOrder.findAll({
    where: { deliveryPartnerId: null, status: "pending" },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
  });

  return orders.map(cleanOrderResponse);
}

// ------------------------------- ACCEPT ORDER SERVICE --------------------------------------

async function acceptOrderService(orderId, deliveryPartnerId) {
  const order = await DeliveryOrder.findOne({
    where: { id: orderId, status: "pending", deliveryPartnerId: null },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
  });

  if (!order) throw new Error("Order not found or already assigned");

  order.deliveryPartnerId = deliveryPartnerId;
  order.status = "picked";
  await order.save();

  return cleanOrderResponse(order);
}

//------------------------------- GET ASSIGNED DELIVERIES SERVICE --------------------------------------

async function getAssignedDeliveriesService(deliveryPartnerId) {
  const orders = await DeliveryOrder.findAll({
    where: { deliveryPartnerId },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders.map(cleanOrderResponse);
}

// ------------------------------- UPDATE DELIVERY STATUS SERVICE --------------------------------------

async function updateDeliveryStatusService(orderId, deliveryPartnerId, status) {
  if (!["picked", "delivered"].includes(status)) throw new Error("Invalid status");

  const order = await DeliveryOrder.findOne({
    where: { id: orderId, deliveryPartnerId },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
  });

  if (!order) throw new Error("Order not found");

  order.status = status;
  if (status === "delivered") order.earning = PER_DELIVERY_EARNING;

  await order.save();

  return cleanOrderResponse(order);
}

module.exports = {
  placeOrderService,
  getUserOrdersService,
  getAvailableOrdersService,
  acceptOrderService,
  getAssignedDeliveriesService,
  updateDeliveryStatusService,
};