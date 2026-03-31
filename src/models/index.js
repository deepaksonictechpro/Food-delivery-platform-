const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database").sequelize;
const db = {};

db.User = require("./user.model")(sequelize, DataTypes);
db.Food = require("./food.model")(sequelize, DataTypes);
db.Like = require("./likes.model")(sequelize, DataTypes);
db.Save = require("./save.model")(sequelize, DataTypes);
db.Order = require("./Order.model")(sequelize, DataTypes);
db.OrderItem = require("./OrderItem.model")(sequelize, DataTypes);
db.Cart = require("./Cart.model")(sequelize, DataTypes);
db.Address = require("./address.model")(sequelize, DataTypes);
db.Review = require("./review.model")(sequelize, DataTypes);
db.FoodPartnerReviews = require("./foodpartner_review.model")(sequelize, DataTypes);
db.Wallet = require("./wallet.model")(sequelize, DataTypes);
db.WalletTransaction = require("./walletTransaction.model")(sequelize, DataTypes);
db.DeliveryPartnerWallet = require("./deliveryPartnerWallet.model")(sequelize, DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
