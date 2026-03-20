'use strict';

module.exports = (sequelize, DataTypes) => {
  const FoodPartnerReview = sequelize.define(
    'FoodPartnerReview',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      foodPartnerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },

      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'FoodPartnerReviews',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'foodPartnerId'],
        },
      ],
    }
  );

  FoodPartnerReview.associate = (models) => {
    FoodPartnerReview.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    FoodPartnerReview.belongsTo(models.User, {
      foreignKey: 'foodPartnerId',
      as: 'foodPartner',
    });
  };

  return FoodPartnerReview;
};