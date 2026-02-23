const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Sequelize");
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    throw error;
  }
}

module.exports = { sequelize, connectDB };
