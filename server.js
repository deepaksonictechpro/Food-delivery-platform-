require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/config/database");
const db = require("./src/models");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync models - using alter: true to update tables without dropping data
    await db.sequelize.sync({ alter: true });
    console.log("✅ Models synchronized successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
    console.error(error);
    process.exit(1);
  }
})();
