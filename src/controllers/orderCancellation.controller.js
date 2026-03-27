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

    const order = await requestCancelOrderService(
      req.user.id,
      orderId,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Cancel request submitted",
      data: order,
    });
  } catch (err) {
    console.error("CANCEL REQUEST ERROR:", err.message);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//------------------------------- ADMIN GETS PENDING CANCEL REQUESTS --------------------------------
const getPendingCancelRequests = async (req, res) => {
  try {
    const orders = await getPendingCancelRequestsService();

    res.status(200).json({
      success: true,
      message: "Pending cancel requests retrieved",
      data: {
        count: orders.length,
        orders,
      },
    });
  } catch (err) {
    console.error("GET PENDING CANCEL REQUESTS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve cancel requests",
    });
  }
};

//------------------------------- ADMIN HANDLES CANCEL DECISION --------------------------------
const handleCancelDecision = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { decision, adminReason } = req.body;

    const order = await handleCancelDecisionService(
      req.user.id,
      orderId,
      decision,
      adminReason
    );

    res.status(200).json({
      success: true,
      message: `Cancellation ${decision}d successfully`,
      data: order,
    });
  } catch (err) {
    console.error("CANCEL DECISION ERROR:", err.message);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  requestCancelOrder,
  handleCancelDecision,
  getPendingCancelRequests,
};