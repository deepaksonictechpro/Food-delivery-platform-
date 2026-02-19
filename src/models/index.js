const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database").sequelize;

const db = {};

// =====================
// Import models
// =====================
db.User = require("./user.model")(sequelize, DataTypes);
db.Food = require("./food.model")(sequelize, DataTypes);
db.Like = require("./likes.model")(sequelize, DataTypes);
db.Save = require("./save.model")(sequelize, DataTypes);
db.DeliveryOrder = require("./DeliveryOrder.model")(sequelize, DataTypes);

// =====================
// Attach Sequelize
// =====================
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// =====================
// Setup associations
// =====================
// Associations must be set AFTER all models are imported
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
