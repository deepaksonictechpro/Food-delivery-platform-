"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Addresses", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Addresses", "doorImage", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Addresses", "phoneNumber");
    await queryInterface.removeColumn("Addresses", "doorImage");
  },
};