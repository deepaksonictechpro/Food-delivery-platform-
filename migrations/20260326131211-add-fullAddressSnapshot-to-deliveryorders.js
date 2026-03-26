"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("DeliveryOrders", "fullAddressSnapshot", {
      type: Sequelize.STRING,
      allowNull: true, // safe first
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("DeliveryOrders", "fullAddressSnapshot");
  },
};