const dashboardService = require("../services/dashboard.services");

//------------------------------- FOOD PARTNER DASHBOARD CONTROLLER --------------------------------------

async function getFoodPartnerDashboard(req, res) {
  try {
    const data = await dashboardService.fetchFoodPartnerDashboard(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[FoodPartnerDashboard]", error.message);
    res.status(500).json({ success: false, message: "Failed to load Food Partner dashboard", error: error.message });
  }
}

//------------------------------- ADMIN DASHBOARD CONTROLLER --------------------------------------

async function getAdminDashboardStats(req, res) {
  try {
    const data = await dashboardService.fetchAdminDashboardStats();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[AdminDashboard]", error.message);
    res.status(500).json({ success: false, message: "Failed to load Admin dashboard", error: error.message });
  }
}

//------------------------------- DELIVERY PARTNER DASHBOARD CONTROLLER --------------------------------------

async function getDeliveryPartnerDashboard(req, res) {
  try {
    const data = await dashboardService.fetchDeliveryPartnerDashboard(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[DeliveryPartnerDashboard]", error.message);
    res.status(500).json({ success: false, message: "Failed to load Delivery Partner dashboard", error: error.message });
  }
}

module.exports = {
  getFoodPartnerDashboard,
  getAdminDashboardStats,
  getDeliveryPartnerDashboard,
};