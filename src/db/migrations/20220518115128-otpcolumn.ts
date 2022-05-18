'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'otp',
    {type:Sequelize.INTEGER
    }
    );
    queryInterface.addColumn(
      'Users',
      'isVerified',
    {type:Sequelize.BOOLEAN
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
