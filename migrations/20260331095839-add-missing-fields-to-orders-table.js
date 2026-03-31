'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'cancelReason', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'cancelRequestedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'cancelApprovedBy', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'cancelApprovedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'cancelDecisionReason', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'previousStatus', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'earning', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    });

    await queryInterface.addColumn('orders', 'cashCollected', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'cancelReason');
    await queryInterface.removeColumn('orders', 'cancelRequestedAt');
    await queryInterface.removeColumn('orders', 'cancelApprovedBy');
    await queryInterface.removeColumn('orders', 'cancelApprovedAt');
    await queryInterface.removeColumn('orders', 'cancelDecisionReason');
    await queryInterface.removeColumn('orders', 'previousStatus');
    await queryInterface.removeColumn('orders', 'earning');
    await queryInterface.removeColumn('orders', 'cashCollected');
  }
};