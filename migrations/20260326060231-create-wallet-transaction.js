'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WalletTransactions', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      walletId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Wallets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      type: {
        type: Sequelize.ENUM('credit', 'debit'),
        allowNull: false,
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      transactionType: {
        type: Sequelize.ENUM(
          'add_money',
          'order_payment',
          'refund',
          'delivery_earning',
          'withdraw',
          'admin_adjustment'
        ),
        allowNull: false,
      },

      referenceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      balanceAfterTransaction: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
        defaultValue: 'success',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WalletTransactions');
  },
};