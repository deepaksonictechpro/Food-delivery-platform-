'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('delivery_orders');
  },

  async down (queryInterface, Sequelize) {
    // You can define how to revert this change here, if needed.
    // For example, you could re-create the table.
    // For now, we'll leave this empty as we don't want to re-create it.
  }
};