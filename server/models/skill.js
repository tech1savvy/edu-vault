'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      Skill.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Skill.init({
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    name: DataTypes.STRING,
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Skill',
    tableName: 'Skills',
  });
  return Skill;
};
