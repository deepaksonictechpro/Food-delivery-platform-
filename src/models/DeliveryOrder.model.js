module.exports = (sequelize, DataTypes) => {
  const DeliveryOrder = sequelize.define("DeliveryOrder", {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    foodId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    deliveryPartnerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    address: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "picked", "delivered"),
      defaultValue: "pending"
    },
    paymentMethod: { type: DataTypes.STRING, allowNull: false }
  });

  DeliveryOrder.associate = (models) => {
    if (models.User) {
      DeliveryOrder.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
        constraints: true,
        onDelete: "CASCADE"
      });

      DeliveryOrder.belongsTo(models.User, {
        foreignKey: { name: "deliveryPartnerId", allowNull: true },
        as: "deliveryPartner",
        constraints: true,
        onDelete: "SET NULL"
      });
    }
  };

  return DeliveryOrder;
};
