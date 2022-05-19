'use strict';

module.exports = {
  async up (queryInterface, _) {
    await queryInterface.removeColumn("Conversations","message")
  },

  async down (queryInterface, _) {
    await queryInterface.removeColumn("Conversations","message")
  }
};
