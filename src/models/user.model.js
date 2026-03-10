const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      fullName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      otp: { type: DataTypes.STRING },
      isOtpVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      role: {
        type: DataTypes.ENUM("user", "food_partner", "delivery_partner", "admin"),
        defaultValue: "user"
      },
      forgotPasswordOtp: { type: DataTypes.STRING },
      isForgotOtpVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      profileImage: { type: DataTypes.STRING, allowNull: true },
      status: { type: DataTypes.ENUM("active","inactive"), defaultValue: "active" },
    }
  );

  // Hash password before creating
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  User.associate = (models) => {
    if (models.Like) User.hasMany(models.Like, { foreignKey: "userId", constraints: false });
    if (models.Save) User.hasMany(models.Save, { foreignKey: "userId", constraints: false });

    // Delivery Orders
    if (models.DeliveryOrder) {
      User.hasMany(models.DeliveryOrder, {
        foreignKey: { name: "userId", allowNull: false },
        as: "orders",
        constraints: true,
        onDelete: "CASCADE"
      });

      User.hasMany(models.DeliveryOrder, {
        foreignKey: { name: "deliveryPartnerId", allowNull: true },
        as: "assignedDeliveries",
        constraints: true,
        onDelete: "SET NULL"
      });
    }
  };

  return User;
};
