// server.js
require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync models ONLY when needed (development/migrations)
    // await sequelize.sync({ alter: true });
    // console.log("✅ Models synchronized");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
    process.exit(1);
  }
}

startServer();