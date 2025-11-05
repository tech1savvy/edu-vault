'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Certification.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    issuer: DataTypes.STRING,
    date: DataTypes.STRING,
    credentialId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Certification',
  });
  return Certification;
};