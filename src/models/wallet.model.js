module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define("Wallet", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },

    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("active", "blocked"),
      defaultValue: "active",
    },
  });

  Wallet.associate = (models) => {
    Wallet.belongsTo(models.User, {
      foreignKey: "userId",
    });

    Wallet.hasMany(models.WalletTransaction, {
      foreignKey: "walletId",
      as: "transactions",
    });
  };

  return Wallet;
};