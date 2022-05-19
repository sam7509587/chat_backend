'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        defaultValue:Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      fullName: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      otpExp: {
        type: Sequelize.DATE
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, _) {
    await queryInterface.dropTable('Users');
  }
};
