'use strict';

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      foodId: {
        type: DataTypes.INTEGER,
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
      tableName: 'Reviews',
      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ['userId', 'foodId'], 
        },
      ],
    }
  );

  // Associations
  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Review.belongsTo(models.Food, {
      foreignKey: 'foodId',
      as: 'food',
    });
  };

  return Review;
};