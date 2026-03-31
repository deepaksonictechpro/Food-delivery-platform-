module.exports = (sequelize, DataTypes) => {
  const DeliveryPartnerWallet = sequelize.define(
    "DeliveryPartnerWallet",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      deliveryPartnerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
      },

      transactionType: {
        type: DataTypes.ENUM("delivery_earning", "withdraw", "adjustment"),
        allowNull: false,
      },

      referenceId: {
        type: DataTypes.INTEGER.UNSIGNED, // refers to Order.id
      },

      balanceAfterTransaction: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "success",
      },
    },
    {
      tableName: "DeliveryPartnerWallets",
      timestamps: true,
    }
  );

  DeliveryPartnerWallet.associate = (models) => {
    DeliveryPartnerWallet.belongsTo(models.User, {
      foreignKey: "deliveryPartnerId",
      as: "deliveryPartner",
    });
  };

  return DeliveryPartnerWallet;
};