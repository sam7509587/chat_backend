'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'password',
     Sequelize.STRING
    );
  },
  async down (queryInterface, _) {
    return queryInterface.removeColumn(
      'Users',
      'password'
    );
  }
};
