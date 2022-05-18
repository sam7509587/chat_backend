'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('Friends','status',Sequelize.STRING)
  },

  async down (__, _) {
    // queryInterface.changeColumn('Friends','status','isAccepted')
  }
};

