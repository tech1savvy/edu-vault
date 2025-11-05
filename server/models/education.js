'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Education.init({
    user_id: DataTypes.INTEGER,
    institution: DataTypes.STRING,
    degree: DataTypes.STRING,
    fieldOfStudy: DataTypes.STRING,
    duration: DataTypes.STRING,
    details: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Education',
    tableName: 'Educations'
  });
  return Education;
};