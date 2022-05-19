'use strict';
import {
  Model
} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(model) {
      User.hasMany(model.Conversation,{
        as:"sentFrom" , foreignKey:"sender"
      });
      User.hasMany(model.Conversation,{
        as:"sentTo" , foreignKey:"receiver"
      })
      
    }
    
  }
  User.init({
    fullName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    otpExp: DataTypes.DATE,
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
    isVerified:{type: DataTypes.BOOLEAN, defaultValue: false},
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
