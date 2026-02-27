module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    foodId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
    Cart.belongsTo(models.Food, { foreignKey: "foodId", as: "food", onDelete: "CASCADE" });
  };

  return Cart;
};