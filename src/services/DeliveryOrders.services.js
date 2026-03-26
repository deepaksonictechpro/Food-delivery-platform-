const { sequelize } = require("../models");
const { DeliveryOrder, Food, User, Cart, Address } = require("../models");
const { PER_DELIVERY_EARNING } = require("../constants/delivery.constants");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");
const { getFoodPartnerStatus } = require("../utils/foodPartnerStatus");

//------------------------------- CLEAN ORDER RESPONSE --------------------------------------

function cleanOrderResponse(order, currentUser = {}) {
  const isDeliveryPartner = currentUser.role === "delivery_partner";
  const isAssignedPartner = order.deliveryPartnerId === currentUser.id;

  const showEarning =
    order.status === ORDER_STATUS.DELIVERED &&
    isDeliveryPartner &&
    isAssignedPartner;

  const response = {
    id: order.id,
    totalAmount: order.totalAmount || 0,
    items: order.food
      ? [{
          foodId: order.foodId,
          name: order.food.name,
          quantity: order.quantity,
          price: order.food.price,
          subtotal: parseFloat(order.food.price) * order.quantity,
        }]
      : [],
    address: {
      id: order.addressId,
      label: order.addressInfo?.label,
      fullAddress:
        order.fullAddressSnapshot || order.addressInfo?.address,
    },
    status: order.status,
    paymentMethod: order.paymentMethod,
    deliveryPartnerId: order.deliveryPartnerId,
    food: order.food || undefined,
    user: order.user
      ? { id: order.user.id, fullName: order.user.fullName }
      : undefined,
  };

  if (showEarning) response.earning = order.earning;

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

// ------------------------------------- PLACE ORDER ----------------------------------------------

async function placeOrderService(userId, cartItems, addressInput, paymentMethod) {
  if (!cartItems?.length) throw new Error("Cart is empty");

  const { addressId, addressLabel } = addressInput || {};

  let addressRecord;

  if (addressId) {
    addressRecord = await Address.findOne({ where: { id: addressId, userId } });
  } else if (addressLabel) {
    addressRecord = await Address.findOne({ where: { label: addressLabel, userId } });
  }

  if (!addressRecord) throw new Error("Address not found or unauthorized");

  const fullAddressSnapshot = `${addressRecord.label}, ${addressRecord.address}, ${addressRecord.city}, ${addressRecord.state}, ${addressRecord.zipCode}, ${addressRecord.country}`;

  return await sequelize.transaction(async (transaction) => {
    const foodIds = cartItems.map(i => i.foodId);

    const foods = await Food.findAll({
      where: { id: foodIds },
      include: [{
        model: User,
        as: "foodPartner",
        attributes: ["openingTime", "closingTime"],
      }],
      transaction,
    });

    for (const food of foods) {
      const status = getFoodPartnerStatus(
        food.foodPartner?.openingTime,
        food.foodPartner?.closingTime
      );

      if (status === "CLOSED") {
        throw new Error(`Food Partner for "${food.name}" is currently closed`);
      }
    }

    const foodMap = {};
    foods.forEach(f => (foodMap[f.id] = f));

    let totalAmount = 0;

    const cartQuantities = cartItems.map(item => {
      if (!item.foodId) throw new Error("Cart item missing foodId");
      if (!item.quantity || item.quantity <= 0) throw new Error("Invalid quantity");

      const food = foodMap[item.foodId];
      if (!food) throw new Error(`Food item ${item.foodId} not found`);

      const subtotal = parseFloat(food.price) * item.quantity;
      totalAmount += subtotal;

      return { foodId: item.foodId, quantity: item.quantity };
    });

    const orderData = cartQuantities.map(item => ({
      foodId: item.foodId,
      userId,
      quantity: item.quantity,
      addressId: addressRecord.id,
      fullAddressSnapshot,
      paymentMethod,
      status: ORDER_STATUS.PENDING,
      earning: 0,
      totalAmount,
    }));

    const createdOrders = await DeliveryOrder.bulkCreate(orderData, {
      transaction,
      returning: true,
    });

    const deletedCount = await Cart.destroy({
      where: { userId, foodId: foodIds },
      transaction,
    });

    if (deletedCount < cartItems.length) {
      throw new Error("Cart cleanup failed");
    }

    const orders = await DeliveryOrder.findAll({
      where: { id: createdOrders.map(o => o.id) },
      include: [
        { model: Food, as: "food" },
        { model: Address, as: "addressInfo" },
      ],
      transaction,
    });

    return orders.map(cleanOrderResponse);
  });
}

// ------------------------------- GET USER ORDERS SERVICE --------------------------------------

async function getUserOrdersService(
  userId,
  { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" },
  currentUser = {}
) {
  const offset = (page - 1) * limit;

  const { count, rows } = await DeliveryOrder.findAndCountAll({
    where: { userId },
    include: [
      { model: Food, as: "food" },
      { model: Address, as: "addressInfo" },
    ],
    order: [[sortBy, order.toUpperCase()]],
    limit,
    offset,
  });

  const orders = rows.map(order => cleanOrderResponse(order, currentUser));

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    orders,
  };
}

// ------------------------------- GET AVAILABLE ORDERS SERVICE --------------------------------------

async function getAvailableOrdersService({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "DESC",
} = {}, currentUser = {}) {
  const offset = (page - 1) * limit;

  const { count, rows } = await DeliveryOrder.findAndCountAll({
    where: {
      deliveryPartnerId: null,
      status: ORDER_STATUS.PENDING,
    },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
      { model: Address, as: "addressInfo" },
    ],
    order: [[sortBy, order.toUpperCase()]],
    limit,
    offset,
  });

  const orders = rows.map((order) => cleanOrderResponse(order, currentUser));

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    orders,
  };
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

  return cleanOrderResponse(order, { id: deliveryPartnerId, role: "delivery_partner" });
}

//------------------------------- GET ASSIGNED DELIVERIES SERVICE --------------------------------------

async function getAssignedDeliveriesService(deliveryPartnerId, currentUser = {}) {
  const orders = await DeliveryOrder.findAll({
    where: { deliveryPartnerId },
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
      { model: Address, as: "addressInfo" },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders.map((order) => cleanOrderResponse(order, currentUser));
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

    await User.increment(
      {
        earnings: PER_DELIVERY_EARNING,
        totalDeliveries: 1,
      },
      {
        where: { id: deliveryPartnerId },
      }
    );
  }

  await order.save();

  const updatedOrder = await DeliveryOrder.findByPk(orderId, {
    include: [
      { model: Food, as: "food" },
      { model: User, as: "user", attributes: ["id", "fullName"] },
      { model: Address, as: "addressInfo" },
    ],
  });

  return cleanOrderResponse(updatedOrder, { id: deliveryPartnerId, role: "delivery_partner" });
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