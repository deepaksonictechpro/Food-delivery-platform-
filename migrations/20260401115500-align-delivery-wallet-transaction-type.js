'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('DeliveryPartnerWallets', 'transactionType', {
      type: Sequelize.ENUM('delivery_earning', 'withdraw', 'adjustment'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('DeliveryPartnerWallets', 'transactionType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
