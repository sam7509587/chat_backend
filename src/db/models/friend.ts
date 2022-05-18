'use strict';
import {
  Model
} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    
    static associate(models) {
      Friend.belongsTo(models.User,{
        as: "sentFrom",foreignKey:"receiver"
      }
        )
    }
  }
  Friend.init({
    sender: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER,
    status:{type: DataTypes.ENUM('unfriend','accepted','pending','rejected','blocked'),
                    defaultValue: "pending"}                                 
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};
