'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    static associate(models) {
      Education.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Education.init({
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    institution: DataTypes.STRING,
    degree: DataTypes.STRING,
    fieldofstudy: DataTypes.STRING,
    duration: DataTypes.STRING,
    details: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Education',
  });
  return Education;
};
