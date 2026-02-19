module.exports = (sequelize, DataTypes) => {
  const Save = sequelize.define(
    "Save",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      foodId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      tableName: "saves",
      timestamps: true,
      indexes: [{ unique: true, fields: ["userId", "foodId"] }],
    }
  );

  Save.associate = (models) => {
    Save.belongsTo(models.User, { foreignKey: "userId" });
    Save.belongsTo(models.Food, { foreignKey: "foodId" });
  };

  return Save;
};
