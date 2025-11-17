'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Achievement extends Model {
    static associate(models) {
      Achievement.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Achievement.init({
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Achievement',
    tableName: 'Achievements',
  });
  return Achievement;
};
