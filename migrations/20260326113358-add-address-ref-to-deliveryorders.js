'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('delivery_orders', 'addressId', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('delivery_orders', 'fullAddressSnapshot', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // optional: keep old address text (for compatibility)
    await queryInterface.changeColumn('delivery_orders', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('delivery_orders', 'fullAddressSnapshot');
    await queryInterface.removeColumn('delivery_orders', 'addressId');

    // optional: revert address not-null if desired
    await queryInterface.changeColumn('delivery_orders', 'address', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
