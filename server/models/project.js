'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Project.init({
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    techstack: DataTypes.STRING,
    timeline: DataTypes.STRING,
    type: DataTypes.STRING,
    collaborators: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'Projects',
  });
  return Project;
};
