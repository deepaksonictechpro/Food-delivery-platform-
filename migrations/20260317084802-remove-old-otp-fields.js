module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'forgotPasswordOtp');
    await queryInterface.removeColumn('Users', 'isForgotOtpVerified');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'forgotPasswordOtp', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('Users', 'isForgotOtpVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};