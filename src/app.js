require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const db = require("./models"); 
const sequelize = db.sequelize;

// Routes
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const deliveryPartnerRoutes = require("./routes/deliveryPartner.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API running"));
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/food-partners", foodPartnerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryPartnerRoutes);




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;
