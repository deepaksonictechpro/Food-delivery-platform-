module.exports = (sequelize, DataTypes) => {

  const DeliveryOrder = sequelize.define("DeliveryOrder", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    foodId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    deliveryPartnerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    addressId: {
      type: DataTypes.UUID,
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
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING",
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    earning: {
      type: DataTypes.FLOAT,
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