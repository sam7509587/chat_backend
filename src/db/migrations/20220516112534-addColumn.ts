'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Messages',
      'isRead',
    {type:Sequelize.BOOLEAN ,
      defaultValue:false
    }
    );
  },
  async down (queryInterface, _) {
     queryInterface.removeColumn(
      'Messages',
      'isRead'
    );
  }
};
