const { ORDER_STATUS } = require("../constants/orderStatus.constants");

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

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    addressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "Addresses",
        key: "id",
      },
    },

    fullAddressSnapshot: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        ORDER_STATUS.PENDING,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.PICKED_UP,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCEL_REQUESTED,
        ORDER_STATUS.CANCELLED
      ),
      defaultValue: ORDER_STATUS.PENDING,
    },

    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    earning: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    // ================= CANCELLATION FIELDS =================

    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    cancelRequestedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    cancelApprovedBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    cancelApprovedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    cancelDecisionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    previousStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // ===================== ASSOCIATIONS =====================
  DeliveryOrder.associate = (models) => {
    DeliveryOrder.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });

    DeliveryOrder.belongsTo(models.User, {
      foreignKey: "deliveryPartnerId",
      as: "deliveryPartner",
      onDelete: "SET NULL",
    });

    DeliveryOrder.belongsTo(models.Food, {
      foreignKey: "foodId",
      as: "food",
      onDelete: "CASCADE",
    });

    DeliveryOrder.belongsTo(models.Address, {
      foreignKey: "addressId",
      as: "addressInfo",
      onDelete: "RESTRICT",
    });
  };

  return DeliveryOrder;
};