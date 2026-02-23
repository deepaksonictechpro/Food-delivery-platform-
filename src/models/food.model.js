module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define(
    "Food",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      video: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      savesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      foodPartnerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "foods",
      timestamps: true,
    }
  );

  // =====================
  // Associations
  // =====================
  Food.associate = (models) => {
    // Food partner (user)
    Food.belongsTo(models.User, {
      foreignKey: "foodPartnerId",
      as: "foodPartner",
      onDelete: "CASCADE",
    });

    // Likes & Saves
    if (models.Like) Food.hasMany(models.Like, { foreignKey: "foodId" });
    if (models.Save) Food.hasMany(models.Save, { foreignKey: "foodId" });

    // ✅ Food → Delivery Orders (FIXED)
    Food.hasMany(models.DeliveryOrder, {
      foreignKey: "foodId",
      as: "orders",
    });
  };

  return Food;
};