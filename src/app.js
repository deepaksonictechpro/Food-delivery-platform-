require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const db = require("./models");
const sequelize = db.sequelize;

// Routes
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const deliveryOrderRoutes = require("./routes/DeliveryOrders.routes");
const adminRoutes = require("./routes/admin.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const ordercancelRoutes = require("./routes/orderCancellation.routes");
const cartRoutes = require("./routes/cart.routes");
const addressRoutes = require("./routes/address.routes");
const deliveryPartnerRoutes = require("./routes/delivery_partner.routes");
const reviewRoutes = require("./routes/review.routes");

const app = express();

// ====== Middleware ======
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ====== Serve Uploaded Files ======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

// ====== Test Route ======
app.get("/", (req, res) => res.send("API running"));

// ====== API Routes ======
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery-orders", deliveryOrderRoutes);
app.use("/api/cancel-Orders", ordercancelRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/Delivery-partner", deliveryPartnerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/review", reviewRoutes);


app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  const requestId = Date.now();

  console.error(`[ERROR] [${requestId}]`, {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(err.statusCode || 500).json({
    message: err.isOperational ? err.message : "Internal Server Error",
    requestId,
  });
});

module.exports = app;