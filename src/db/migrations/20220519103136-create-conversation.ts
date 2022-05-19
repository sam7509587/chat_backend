'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Conversations', {
      id: {
        defaultValue:Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      sender: {
        type: Sequelize.UUID
      },
      receiver: {
        type: Sequelize.UUID
      },
      message: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('accepted','pending','rejected',"blocked","unblocked","unfriend"),
        defaultValue: "pending"
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
    await queryInterface.dropTable('Conversations');
  }
};
