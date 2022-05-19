'use strict';
import {
  Model
} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model) {
      Conversation.belongsTo(model.User,{
        as:"sentFrom",foreignKey:"sender"
      })
      Conversation.belongsTo(model.User,{
        as:"sentTo",foreignKey:"receiver"
      })
    }
  }
  Conversation.init({
    sender: DataTypes.UUID,
    receiver: DataTypes.UUID,
    status:  {
      type: DataTypes.ENUM('accepted','pending','rejected',"blocked","unblocked","unfriend"),
      defaultValue: "pending"
    }, 
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
