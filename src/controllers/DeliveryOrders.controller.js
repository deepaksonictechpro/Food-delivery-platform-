const deliveryService = require("../services/DeliveryOrders.services");

//================================= USER places order ===================================

const placeOrder = async (req, res) => {
  try {
    const { foodId, quantity, address, paymentMethod } = req.body;
    const order = await deliveryService.placeOrderService(req.user.id, foodId, quantity, address, paymentMethod);
    return res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ================================== USER: my orders ===================================

const getUserOrders = async (req, res) => {
  try {
    const orders = await deliveryService.getUserOrdersService(req.user.id);
    return res.status(200).json({ orders });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

//=========================== DELIVERY PARTNER: available orders ============================

const getAvailableOrders = async (req, res) => {
  try {
    const orders = await deliveryService.getAvailableOrdersService();
    return res.status(200).json({ orders });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

//=========================== DELIVERY PARTNER: accept order ===========================

const acceptOrder = async (req, res) => {
  try {
    const order = await deliveryService.acceptOrderService(req.params.id, req.user.id);
    return res.status(200).json({ message: "Order assigned successfully", order });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

//============================= DELIVERY PARTNER: assigned orders ===========================

const getAssignedDeliveries = async (req, res) => {
  try {
    const orders = await deliveryService.getAssignedDeliveriesService(req.user.id);
    return res.status(200).json({ orders });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

//============================= DELIVERY PARTNER: update status ==============================

const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await deliveryService.updateDeliveryStatusService(req.params.id, req.user.id, req.body.status);
    return res.status(200).json({ message: "Status updated", order });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAvailableOrders,
  acceptOrder,
  getAssignedDeliveries,
  updateDeliveryStatus,
};