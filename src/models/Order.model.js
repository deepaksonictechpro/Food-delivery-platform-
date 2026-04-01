'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Order.belongsTo(models.User, { foreignKey: 'deliveryPartnerId', as: 'deliveryPartner' });
      Order.belongsTo(models.Address, { foreignKey: 'addressId', as: 'addressInfo' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    }
  }

  Order.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',
    },
    paymentMethod: {
      type: DataTypes.ENUM('COD', 'ONLINE', 'WALLET'),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID'),
      defaultValue: 'PENDING',
    },
    cancelReason: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    previousStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    earning: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    cashCollected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  });

  return Order;
};
