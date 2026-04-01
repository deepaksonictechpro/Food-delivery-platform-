'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'resetOtp', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'isResetOtpVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('Users', 'resetOtpExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'resetOtpAttempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'tokenVersion', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'tokenVersion');
    await queryInterface.removeColumn('Users', 'resetOtpAttempts');
    await queryInterface.removeColumn('Users', 'resetOtpExpiresAt');
    await queryInterface.removeColumn('Users', 'isResetOtpVerified');
    await queryInterface.removeColumn('Users', 'resetOtp');
  },
};
