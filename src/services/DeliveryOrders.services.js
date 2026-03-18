const { sequelize } = require("../models");
const { DeliveryOrder, Food, User, Cart } = require("../models");
const { PER_DELIVERY_EARNING } = require("../constants/delivery.constants");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");

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
    user: order.user
      ? { id: order.user.id, fullName: order.user.fullName }
      : undefined,
  };

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
  if (!cartItems || !cartItems.length) {
    throw new Error("Cart is empty");
  }

  return await sequelize.transaction(async (transaction) => {
    const orderData = cartItems.map((item) => {
      if (!item.foodId) throw new Error("Cart item missing foodId");

      if (!item.quantity || item.quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      return {
        foodId: item.foodId,
        userId,
        quantity: item.quantity,
        address,
        paymentMethod,
        status: ORDER_STATUS.PENDING,
        earning: 0,
      };
    });

    const createdOrders = await DeliveryOrder.bulkCreate(orderData, {
      transaction,
      returning: true,
    });

    if (!createdOrders.length) {
      throw new Error("Failed to create orders");
    }

    const foodIds = cartItems.map((item) => item.foodId);

    const deletedCount = await Cart.destroy({
      where: {
        userId,
        foodId: foodIds,
      },
      transaction,
    });

    if (deletedCount !== cartItems.length) {
      throw new Error("Cart cleanup failed");
    }

    const ordersWithDetails = await DeliveryOrder.findAll({
      where: {
        id: createdOrders.map((o) => o.id),
      },
      include: [{ model: Food, as: "food" }],
      transaction,
    });

    return ordersWithDetails.map(cleanOrderResponse);
  });
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
    where: {
      deliveryPartnerId: null,
      status: ORDER_STATUS.PENDING,
    },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
  });

  return orders.map(cleanOrderResponse);
}

// ------------------------------- ACCEPT ORDER SERVICE --------------------------------------

async function acceptOrderService(orderId, deliveryPartnerId) {
  await checkDeliveryPartnerProfile(deliveryPartnerId);

  const order = await DeliveryOrder.findOne({
    where: {
      id: orderId,
      status: ORDER_STATUS.PENDING,
      deliveryPartnerId: null,
    },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
  });

  if (!order) throw new Error("Order not found or already assigned");

  order.deliveryPartnerId = deliveryPartnerId;
  order.status = ORDER_STATUS.ACCEPTED;

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
  if (
    ![
      ORDER_STATUS.PICKED_UP,
      ORDER_STATUS.DELIVERED,
    ].includes(status)
  ) {
    throw new Error("Invalid status");
  }

  const order = await DeliveryOrder.findOne({
    where: { id: orderId, deliveryPartnerId },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
    ],
  });

  if (!order) throw new Error("Order not found");

  order.status = status;

  if (status === ORDER_STATUS.DELIVERED) {
    order.earning = PER_DELIVERY_EARNING;
  }

  await order.save();

  return cleanOrderResponse(order);
}

// ------------------------------- DELIVERY PARTNER PROFILE CHECK --------------------------------------

async function checkDeliveryPartnerProfile(deliveryPartnerId) {
  const partner = await User.findOne({
    where: {
      id: deliveryPartnerId,
      role: "delivery_partner",
      status: "active",
    },
  });

  if (!partner) {
    throw new Error("Delivery partner not found or inactive");
  }

  if (!partner.phoneNumber) {
    throw new Error("Please add phone number before accepting orders");
  }

  if (!partner.vehicleType) {
    throw new Error("Please update vehicle type in profile");
  }

  if (!partner.vehicleNumber) {
    throw new Error("Please update vehicle number in profile");
  }

  if (!partner.drivingLicenseNumber) {
    throw new Error("Please update driving license number");
  }

  return partner;
}

module.exports = {
  placeOrderService,
  getUserOrdersService,
  getAvailableOrdersService,
  acceptOrderService,
  getAssignedDeliveriesService,
  updateDeliveryStatusService,
};