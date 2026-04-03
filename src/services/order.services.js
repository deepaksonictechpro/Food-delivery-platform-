const { sequelize } = require("../models");
const { Order, OrderItem, Food, User, Cart, Address, WalletTransaction } = require("../models");
const { PER_DELIVERY_EARNING } = require("../constants/delivery.constants");
const { ORDER_STATUS } = require("../constants/orderStatus.constants");
const { getFoodPartnerStatus } = require("../utils/foodPartnerStatus");
const { addEarningToWallet } = require("./deliveryPartnerWallet.services");

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
    totalAmount: parseFloat(order.totalAmount) || 0,
    items: order.items.map(item => ({
      foodId: item.foodId,
      name: item.food.name,
      quantity: item.quantity,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.price) * item.quantity,
    })),
    address: {
      id: order.addressId,
      label: order.addressInfo?.label,
      fullAddress: order.addressInfo?.address,
    },
    status: order.status,
    paymentMethod: order.paymentMethod,
    deliveryPartnerId: order.deliveryPartnerId,
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

  return await sequelize.transaction(async (transaction) => {
    const foodIds = cartItems.map(i => i.foodId);
    const foods = await Food.findAll({ where: { id: foodIds }, transaction });

    const foodMap = new Map(foods.map(f => [f.id, f]));

    let totalAmount = 0;
    const orderItemsData = cartItems.map(item => {
      const food = foodMap.get(item.foodId);
      if (!food) throw new Error(`Food item ${item.foodId} not found`);
      const price = parseFloat(food.price);
      totalAmount += price * item.quantity;
      return { foodId: item.foodId, quantity: item.quantity, price };
    });

    const order = await Order.create({
      userId,
      addressId: addressRecord.id,
      totalAmount,
      paymentMethod,
      status: ORDER_STATUS.PENDING,
      paymentStatus: 'PENDING',
    }, { transaction });

    const finalOrderItems = orderItemsData.map(item => ({ ...item, orderId: order.id }));
    await OrderItem.bulkCreate(finalOrderItems, { transaction });

    await Cart.destroy({ where: { userId, foodId: foodIds }, transaction });

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName'] },
        { model: Address, as: 'addressInfo' },
        { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
      ],
      transaction,
    });

    return createdOrder;
  });
}

// ------------------------------- GET USER ORDERS SERVICE --------------------------------------

async function getUserOrdersService(
  userId,
  { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" },
  currentUser = {}
) {
  const offset = (page - 1) * limit;

  const { count, rows } = await Order.findAndCountAll({
    where: { userId },
    include: [
      { model: Address, as: "addressInfo" },
      { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
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

  const { count, rows } = await Order.findAndCountAll({
    where: {
      deliveryPartnerId: null,
      status: ORDER_STATUS.PENDING,
    },
    include: [
      { model: User, as: "user", attributes: ["id", "fullName"] },
      { model: Address, as: "addressInfo" },
      { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
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
  const partner = await checkDeliveryPartnerProfile(deliveryPartnerId);

  return await sequelize.transaction(async (transaction) => {
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        { model: User, as: "user", attributes: ["id", "fullName", "openingTime", "closingTime"] },
        { model: Address, as: "addressInfo" },
        { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) throw new Error("Order not found");

    if (order.status !== ORDER_STATUS.PENDING || order.deliveryPartnerId) {
      throw new Error("Order not found or already assigned");
    }

    // CHECK FOOD PARTNER STATUS
    const restaurantStatus = getFoodPartnerStatus(
      order.user?.openingTime,
      order.user?.closingTime
    );

    if (restaurantStatus !== "OPEN") {
      throw new Error("Restaurant is currently closed");
    }

    order.deliveryPartnerId = deliveryPartnerId;
    order.status = ORDER_STATUS.ACCEPTED;

    await order.save({ transaction });

    return cleanOrderResponse(order, { id: deliveryPartnerId, role: "delivery_partner" });
  });
}

//------------------------------- GET ASSIGNED DELIVERIES SERVICE --------------------------------------

async function getAssignedDeliveriesService(deliveryPartnerId, currentUser = {}) {
  const orders = await Order.findAll({
    where: { deliveryPartnerId },
    include: [
      { model: User, as: "user", attributes: ["id", "fullName"] },
      { model: Address, as: "addressInfo" },
      { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders.map((order) => cleanOrderResponse(order, currentUser));
}

// ------------------------------- UPDATE DELIVERY STATUS SERVICE --------------------------------------

async function updateDeliveryStatusService(orderId, deliveryPartnerId, status, cashCollected = null) {
  return await sequelize.transaction(async (t) => {

    const partner = await User.findOne({
      where: { id: deliveryPartnerId, role: "delivery_partner" },
      transaction: t,
    });

    if (!partner) {
      throw new Error("Only delivery partner can update status");
    }

    if (![ORDER_STATUS.PICKED_UP, ORDER_STATUS.DELIVERED].includes(status)) {
      throw new Error("Invalid status");
    }

    const order = await Order.findOne({
      where: { id: orderId, deliveryPartnerId },
      include: [
        { model: User, as: "user", attributes: ["id", "fullName"] },
        { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) throw new Error("Order not found");

    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new Error("Order already delivered");
    }

    if (status === ORDER_STATUS.PICKED_UP && order.status !== ORDER_STATUS.ACCEPTED) {
      throw new Error("Order must be ACCEPTED before pickup");
    }

    if (status === ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.PICKED_UP) {
      throw new Error("Order must be PICKED_UP before delivery");
    }

    if (cashCollected !== null) {
      order.cashCollected = !!cashCollected;
    }

    if (
      status === ORDER_STATUS.PICKED_UP &&
      order.paymentMethod !== "COD" &&
      order.paymentStatus !== "PAID"
    ) {
      throw new Error("Cannot pickup unpaid order");
    }

    // UPDATED BLOCK
    if (status === ORDER_STATUS.DELIVERED) {

      //track actual delivery time
      order.deliveredAt = new Date();

      if (order.paymentMethod === "WALLET") {
        const paymentTx = await WalletTransaction.findOne({
          where: {
            userId: order.userId,
            referenceId: order.id,
            transactionType: "order_payment",
            status: "success"
          },
          transaction: t
        });

        if (!paymentTx) {
          throw new Error("Online payment not completed");
        }

        order.paymentStatus = "PAID";
      }

      if (order.paymentMethod === "COD" && !order.cashCollected) {
        throw new Error("Cash not collected yet");
      }

      if (parseFloat(order.earning || 0) > 0) {
        throw new Error("Earning already processed for this order");
      }

      order.earning = PER_DELIVERY_EARNING;

      await User.increment(
        {
          earnings: PER_DELIVERY_EARNING,
          totalDeliveries: 1,
        },
        {
          where: { id: deliveryPartnerId },
          transaction: t
        }
      );

      await addEarningToWallet(deliveryPartnerId, order.id, t);
    }

    order.status = status;
    await order.save({ transaction: t });

    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: "user", attributes: ["id", "fullName"] },
        { model: Address, as: "addressInfo" },
        { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
      ],
      transaction: t,
    });

    return cleanOrderResponse(updatedOrder, { id: deliveryPartnerId, role: "delivery_partner" });
  });
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
