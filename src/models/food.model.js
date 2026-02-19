module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define(
    "Food",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
      video: { type: DataTypes.STRING, allowNull: false },
      likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      savesCount: { type: DataTypes.INTEGER, defaultValue: 0 },

      // Foreign key to User table (food_partner role)
      foodPartnerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "foods",
      timestamps: true,
    }
  );

  Food.associate = (models) => {
    // Each Food belongs to a User (food_partner role)
    Food.belongsTo(models.User, {
      foreignKey: "foodPartnerId",
      as: "foodPartner",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Likes & Saves associations
    if (models.Like) Food.hasMany(models.Like, { foreignKey: "foodId" });
    if (models.Save) Food.hasMany(models.Save, { foreignKey: "foodId" });
  };

  return Food;
};
