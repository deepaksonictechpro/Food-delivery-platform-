"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DeliveryPartnerWallets", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      deliveryPartnerId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "Users", 
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM("credit", "debit"),
        allowNull: false,
      },

      transactionType: {
        type: Sequelize.STRING,
      },

      referenceId: {
        type: Sequelize.INTEGER,
      },

      balanceAfterTransaction: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: "success",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DeliveryPartnerWallets");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_DeliveryPartnerWallets_type";'
    );
  },
};