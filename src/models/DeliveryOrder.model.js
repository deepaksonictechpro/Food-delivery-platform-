module.exports = (sequelize, DataTypes) => {

  const DeliveryOrder = sequelize.define("DeliveryOrder", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    foodId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    deliveryPartnerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    addressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    fullAddressSnapshot: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    paymentMethod: {
      type: DataTypes.ENUM("COD", "ONLINE", "WALLET"),
      allowNull: false,
    },

    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID"),
      defaultValue: "PENDING",
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING",
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    earning: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    cashCollected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  // ✅ ASSOCIATIONS (INSIDE FUNCTION, BEFORE RETURN)
  DeliveryOrder.associate = (models) => {
    DeliveryOrder.belongsTo(models.Food, {
      foreignKey: "foodId",
      as: "food",
    });

    DeliveryOrder.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    DeliveryOrder.belongsTo(models.User, {
      foreignKey: "deliveryPartnerId",
      as: "deliveryPartner",
    });

    DeliveryOrder.belongsTo(models.Address, {
      foreignKey: "addressId",
      as: "addressInfo",
    });
  };

  return DeliveryOrder;
};