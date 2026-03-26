const deliveryService = require("../services/DeliveryOrders.services");
const { getCartService } = require("../services/cart.services");

//------------------------------- PLACE ORDER FROM CART --------------------------------------

const placeOrder = async (req, res) => {
  try {
    const { addressId, addressLabel, paymentMethod } = req.body;

    // Fetch user's cart
    const cartItems = await getCartService(req.user.id);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const orders = await deliveryService.placeOrderService(
      req.user.id,
      cartItems,
      { addressId, addressLabel },
      paymentMethod
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: orders
    });
  } catch (err) {
    console.error("PLACE ORDER ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to place order"
    });
  }
};

//------------------------------- GET USER ORDERS --------------------------------------

const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" } = req.query;

    const result = await deliveryService.getUserOrdersService(req.user.id, {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      order,
    }, req.user);

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};


//----------------------------- GET AVAILABLE ORDERS FOR DELIVERY PARTNERS ----------------------

const getAvailableOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" } = req.query;

    const result = await deliveryService.getAvailableOrdersService({
      page: Number(page),
      limit: Number(limit),
      sortBy,
      order,
    }, req.user);

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

//------------------------------- DELIVERY PARTNER: ACCEPT ORDER --------------------------------------

const acceptOrder = async (req, res) => {
  try {
    const order = await deliveryService.acceptOrderService(req.params.id, req.user.id);
    res.status(200).json({ message: "Order assigned successfully", order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

//------------------------------- DELIVERY PARTNER: GET ASSIGNED DELIVERIES ---------------------------

const getAssignedDeliveries = async (req, res) => {
  try {
    const orders = await deliveryService.getAssignedDeliveriesService(req.user.id, req.user);
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

//------------------------------- DELIVERY PARTNER: UPDATE DELIVERY STATUS -------------------------------

const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await deliveryService.updateDeliveryStatusService(
      req.params.id,
      req.user.id,
      req.body.status
    );
    res.status(200).json({ message: "Status updated", order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
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