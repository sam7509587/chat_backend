'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users','id',{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.UUID
    })
  },

  async down (__, _) {
    // queryInterface.changeColumn('Friends','status','isAccepted')
  }
};

