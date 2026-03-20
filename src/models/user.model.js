const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {

    // ================= BASIC USER INFO =================
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false, 
      unique: true,
      validate: { isEmail: true }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM("user", "food_partner", "delivery_partner", "admin"),
      defaultValue: "user"
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active"
    },


    // ================= OTP VERIFICATION =================
    otp: {
      type: DataTypes.STRING
    },

    isOtpVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    otpAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },


    // ================= DELIVERY PARTNER INFO =================
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: true
    },

    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },

    drivingLicenseNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },

    totalDeliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    earnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }

  });


  // ================= PASSWORD HASHING =================
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });


  // ================= MODEL ASSOCIATIONS =================
  User.associate = (models) => {

    // Likes
    if (models.Like) {
      User.hasMany(models.Like, {
        foreignKey: "userId",
        constraints: false
      });
    }

    // Saves
    if (models.Save) {
      User.hasMany(models.Save, {
        foreignKey: "userId",
        constraints: false
      });
    }

    if (models.Review) {
      User.hasMany(models.Review, {
        foreignKey: "userId",
        as: "reviews",
        constraints: true,
        onDelete: "CASCADE"
      });
    }    

    // Orders placed by user
    if (models.DeliveryOrder) {
      User.hasMany(models.DeliveryOrder, {
        foreignKey: { name: "userId", allowNull: false },
        as: "orders",
        constraints: true,
        onDelete: "CASCADE"
      });

      // Orders handled by delivery partner
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