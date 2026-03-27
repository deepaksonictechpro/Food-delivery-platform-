module.exports = (sequelize, DataTypes) => {
  const WalletTransaction = sequelize.define("WalletTransaction", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    walletId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("credit", "debit"),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    transactionType: {
      type: DataTypes.ENUM(
        "add_money",
        "order_payment",
        "refund",
        "delivery_earning",
        "withdraw",
        "admin_adjustment"
      ),
      allowNull: false,
    },

    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    balanceAfterTransaction: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "success",
    },
  });

  WalletTransaction.associate = (models) => {
    WalletTransaction.belongsTo(models.Wallet, {
      foreignKey: "walletId",
    });

    WalletTransaction.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return WalletTransaction;
};