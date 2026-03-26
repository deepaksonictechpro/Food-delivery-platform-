"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Foods");

    if (!table.foodPartnerId) {
      await queryInterface.addColumn("Foods", "foodPartnerId", {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Foods", "foodPartnerId");
  },
};