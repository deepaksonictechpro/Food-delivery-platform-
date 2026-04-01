'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('Carts', {
      fields: ['userId', 'foodId'],
      type: 'unique',
      name: 'carts_user_food_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('Carts', 'carts_user_food_unique');
  },
};
