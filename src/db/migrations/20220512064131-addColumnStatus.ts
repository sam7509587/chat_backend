'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Friends',
      'status',
    {type: Sequelize.ENUM('completed','pending','rejected'),
      allowNull: false,
      defaultValue: "pending"
    }
    );
  },
  async down (queryInterface, _) {
    return queryInterface.removeColumn(
      'Friends',
      'status'
    );
  }
};
