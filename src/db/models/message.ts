'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    
    static associate(models) {
      Message.belongsTo(models.User,{
        as: "sender",foreignKey:"from"
      })
      Message.belongsTo(models.User,{
        as: "receiver",foreignKey:"to"
      })
    }
  }
  Message.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    deletedBy: {type:DataTypes.BOOLEAN,
    defaultValue: []},
    isRead:{type:DataTypes.BOOLEAN,
      defaultValue:false}
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
