module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },

      // Must match parent columns
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      foodId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      tableName: "likes",
      timestamps: true,
      indexes: [{ unique: true, fields: ["userId", "foodId"] }],
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
    Like.belongsTo(models.Food, { foreignKey: "foodId", onDelete: "CASCADE", onUpdate: "CASCADE" });
  };

  return Like;
};
