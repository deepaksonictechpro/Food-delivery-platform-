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

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "picked", "delivered"),
      defaultValue: "pending",
    },

    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // =====================
  // Associations
  // =====================
  DeliveryOrder.associate = (models) => {
    // User who placed order
    DeliveryOrder.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });

    // Delivery partner
    DeliveryOrder.belongsTo(models.User, {
      foreignKey: "deliveryPartnerId",
      as: "deliveryPartner",
      onDelete: "SET NULL",
    });

    //  Food association (FIXED)
    DeliveryOrder.belongsTo(models.Food, {
      foreignKey: "foodId",
      as: "food",
      onDelete: "CASCADE",
    });
  };

  return DeliveryOrder;
};