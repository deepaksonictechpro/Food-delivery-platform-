'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_orders', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      foodId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      deliveryPartnerId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      addressId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      fullAddressSnapshot: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'accepted',
          'picked_up',
          'delivered',
          'cancel_requested',
          'cancelled'
        ),
        defaultValue: 'pending',
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      earning: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      cancelReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cancelRequestedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cancelApprovedBy: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      cancelApprovedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cancelDecisionReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      previousStatus: {
        type: Sequelize.STRING,
        allowNull: true,
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

    // Add foreign key constraints
    await queryInterface.addConstraint('delivery_orders', {
      fields: ['foodId'],
      type: 'foreign key',
      name: 'fk_delivery_orders_foodId',
      references: {
        table: 'foods',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('delivery_orders', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_delivery_orders_userId',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('delivery_orders', {
      fields: ['deliveryPartnerId'],
      type: 'foreign key',
      name: 'fk_delivery_orders_deliveryPartnerId',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addConstraint('delivery_orders', {
      fields: ['addressId'],
      type: 'foreign key',
      name: 'fk_delivery_orders_addressId',
      references: {
        table: 'addresses',
        field: 'id',
      },
      onDelete: 'RESTRICT',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('delivery_orders');
  }
};
