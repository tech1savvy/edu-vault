'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    securityQuestion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'security_question',
    },
    securityAnswer: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'security_answer',
    },
    resetToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reset_token',
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_token_expiry',
    },
    role: {
      type: DataTypes.ENUM('student', 'administrator'),
      defaultValue: 'student'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};