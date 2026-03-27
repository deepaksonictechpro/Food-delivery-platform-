module.exports = (sequelize, DataTypes) => {
  const DeliveryPartnerWallet = sequelize.define(
    "DeliveryPartnerWallet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      deliveryPartnerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
      },

      transactionType: {
        type: DataTypes.STRING, // delivery_earning
      },

      referenceId: {
        type: DataTypes.INTEGER, // orderId
      },

      balanceAfterTransaction: {
        type: DataTypes.FLOAT,
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