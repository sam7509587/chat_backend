'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      to: {
        type: Sequelize.UUID
      },
      from: {
        type: Sequelize.UUID
      },
      message: {
        type: Sequelize.STRING
      },
      conversationId: {
        type: Sequelize.UUID
      },
      deletedBy: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        defaultValue: []
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('Messages');
  }
};
