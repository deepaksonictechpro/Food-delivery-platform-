const {
  requestCancelOrderService,
  handleCancelDecisionService,
  getPendingCancelRequestsService, 
} = require("../services/orderCancellation.services");

//-------------------------------- USER REQUESTS ORDER CANCELLATION --------------------------------
const requestCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = await requestCancelOrderService(req.user.id, orderId, reason);
    res.status(200).json({ message: "Cancel request submitted", order });
  } catch (err) {
    console.error("CANCEL REQUEST ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

//------------------------------- ADMIN GETS PENDING CANCEL REQUESTS --------------------------------
const getPendingCancelRequests = async (req, res) => {
  try {
    const orders = await getPendingCancelRequestsService(); 
    res.status(200).json({ count: orders.length, orders });
  } catch (err) {
    console.error("GET PENDING CANCEL REQUESTS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//------------------------------- ADMIN HANDLES CANCEL DECISION --------------------------------

const handleCancelDecision = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { decision, adminReason } = req.body;
    const order = await handleCancelDecisionService(req.user.id, orderId, decision, adminReason);
    res.status(200).json({ message: `Cancellation ${decision}d successfully`, order });
  } catch (err) {
    console.error("CANCEL DECISION ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { 
  requestCancelOrder, 
  handleCancelDecision, 
  getPendingCancelRequests,
};