const { DeliveryOrder, Food, User } = require("../models");

// ===========================
// User places a delivery order
// ===========================
exports.placeOrder = async (req, res) => {
  try {
    const { foodId, quantity, address, paymentMethod } = req.body;

    if (!foodId || !quantity || !address || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if food exists
    const food = await Food.findByPk(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const order = await DeliveryOrder.create({
      foodId,
      userId: req.user.id,          // from authUserMiddleware
      quantity,
      address,
      paymentMethod,
      status: "pending",
    });

    return res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// User views their orders
// ===========================
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await DeliveryOrder.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Food, as: "food" },
        { model: User, as: "deliveryPartner", attributes: ["id", "fullName"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Delivery Partner: view available orders (not assigned yet)
// ===========================
exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await DeliveryOrder.findAll({
      where: { deliveryPartnerId: null, status: "pending" },
      include: [
        { model: Food, as: "food" },
        { model: User, as: "user", attributes: ["id", "fullName"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    

    return res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Delivery Partner: accept/assign order to self
// ===========================
exports.acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await DeliveryOrder.findOne({
      where: { id, deliveryPartnerId: null, status: "pending" },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found or already assigned" });
    }

    order.deliveryPartnerId = req.user.id;
    order.status = "picked";
    await order.save();

    return res.status(200).json({ message: "Order assigned to you", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Delivery Partner: view assigned deliveries
// ===========================
exports.getAssignedDeliveries = async (req, res) => {
  try {
    const orders = await DeliveryOrder.findAll({
      where: { deliveryPartnerId: req.user.id },
      include: [
        { model: Food, as: "food" },
        { model: User, as: "user", attributes: ["id", "fullName"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Delivery Partner: update status
// ===========================
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "picked", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await DeliveryOrder.findOne({
      where: { id, deliveryPartnerId: req.user.id },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
