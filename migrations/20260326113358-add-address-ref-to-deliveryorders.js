"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("DeliveryOrders");

  
    if (!table.addressId) {
      await queryInterface.addColumn("DeliveryOrders", "addressId", {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("DeliveryOrders", "addressId");
  },
};