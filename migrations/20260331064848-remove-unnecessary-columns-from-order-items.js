'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('OrderItems', 'userId');
    await queryInterface.removeColumn('OrderItems', 'deliveryPartnerId');
    await queryInterface.removeColumn('OrderItems', 'addressId');
    await queryInterface.removeColumn('OrderItems', 'fullAddressSnapshot');
    await queryInterface.removeColumn('OrderItems', 'paymentMethod');
    await queryInterface.removeColumn('OrderItems', 'paymentStatus');
    await queryInterface.removeColumn('OrderItems', 'status');
    await queryInterface.removeColumn('OrderItems', 'totalAmount');
    await queryInterface.removeColumn('OrderItems', 'earning');
    await queryInterface.removeColumn('OrderItems', 'cashCollected');
  },

  async down (queryInterface, Sequelize) {
    // Add the columns back if you need to revert
  }
};