'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Messages',
      'conversationId',
    {type:Sequelize.INTEGER ,
    }
    );
  },
  async down (queryInterface, _) {
     queryInterface.removeColumn(
      'Messages',
      'conversationId'
    );
  }
};
