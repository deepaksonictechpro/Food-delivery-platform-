"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("DeliveryOrders");

    if (!table.totalAmount) {
      await queryInterface.addColumn("DeliveryOrders", "totalAmount", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("DeliveryOrders", "totalAmount");
  },
};