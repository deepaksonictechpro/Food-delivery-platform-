'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('OrderItems', 'orderId', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('OrderItems', 'orderId', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    });
  }
};