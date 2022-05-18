'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Messages',
      'deletedBy',
    {type:Sequelize.ARRAY(Sequelize.INTEGER)
    }
    );
  },
  async down (queryInterface, _) {
     queryInterface.removeColumn(
      'Messages',
      'deletedBy'
    );
  }
};
