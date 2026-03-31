'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('DeliveryOrders', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'paid'),
      defaultValue: 'pending',
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('DeliveryOrders', 'paymentStatus');
  }
};