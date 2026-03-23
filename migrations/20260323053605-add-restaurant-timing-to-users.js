'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'openingTime', {
      type: Sequelize.TIME,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'closingTime', {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'openingTime');
    await queryInterface.removeColumn('Users', 'closingTime');
  },
};