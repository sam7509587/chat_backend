'use strict';
import {
  Model,Sequelize,
} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model {
    static associate(models: any) {
      User.hasMany(models.Friend,{
        as : "friends",foreignKey:"receiver"
      });
      User.hasMany(models.Message,{
        as : "sender",foreignKey:"from"
      })
      User.hasMany(models.Message,{
        as : "receiver",foreignKey:"to"
      })
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    password:DataTypes.STRING,
    email: DataTypes.STRING,
    otp:DataTypes.INTEGER,
    isVerified: DataTypes.BOOLEAN,
    
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
