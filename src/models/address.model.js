module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("Address", {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false }, 
    address: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: {type: DataTypes.STRING, allowNull: false},
    doorImage: {type: DataTypes.STRING, allowNull: true},
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    zipCode: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Address;
};