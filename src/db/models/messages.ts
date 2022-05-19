'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_) {
      // define association here
    }
  }
  Messages.init({
    to: DataTypes.UUID,
    from: DataTypes.UUID,
    message: DataTypes.STRING,
    conversationId: DataTypes.UUID,
    deletedBy: DataTypes.ARRAY(DataTypes.UUID),
    isRead: {type: DataTypes.BOOLEAN , defaultValue: false}
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return Messages;
};
