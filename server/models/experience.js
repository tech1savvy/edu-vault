'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Experience.init({
    user_id: DataTypes.INTEGER,
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