// app.js
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
const deliveryPartnerRoutes = require("./routes/DeliveryOrders.routes");
const adminRoutes = require("./routes/admin.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const ordercancelRoutes = require("./routes/orderCancellation.routes");
const cardRoutes = require("./routes/cart.routes");
const addressRoutes = require("./routes/address.routes");

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
app.use("/api/food-partners", foodPartnerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryPartnerRoutes);
app.use("/api/placeOrder", ordercancelRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/address", addressRoutes);

// ====== Dashboard Routes ======
app.use("/api/dashboard", dashboardRoutes);

// ====== Error Handling Middleware ======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// ====== 404 Handler ======
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;