'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    static associate(models) {
      Experience.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Experience.init({
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    type: DataTypes.STRING,
    company: DataTypes.STRING,
    role: DataTypes.STRING,
    duration: DataTypes.STRING,
    details: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Experience',
  });
  return Experience;
};
