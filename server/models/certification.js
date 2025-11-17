'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certification extends Model {
    static associate(models) {
      Certification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Certification.init({
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    name: DataTypes.STRING,
    issuer: DataTypes.STRING,
    date: DataTypes.STRING,
    credentialId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Certification',
    tableName: 'Certifications',
  });
  return Certification;
};
