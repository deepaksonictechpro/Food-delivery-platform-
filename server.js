require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./src/config/database");
const PORT = process.env.PORT || 5000;
const { cleanupUnverifiedUsers } = require("./src/services/auth.services");

setInterval(() => {
  cleanupUnverifiedUsers();
}, 5 * 60 * 1000);

async function startServer() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("🟢 DB connected");

    // // Sync models ONLY when needed (development/migrations)
    // await sequelize.sync({ alter: true });
    // console.log("✅ Models synchronized");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server Boot Successful ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
    process.exit(1);
  }
}

startServer();