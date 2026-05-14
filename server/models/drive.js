'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Drive extends Model {
    static associate(models) {
      Drive.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      Drive.hasMany(models.DriveStage, { foreignKey: 'driveId', as: 'stages' });
      Drive.hasMany(models.JobDescription, { foreignKey: 'driveId', as: 'jobDescriptions' });
    }
  }

  Drive.init({
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'company_name'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'active', 'closed'),
      defaultValue: 'upcoming'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      field: 'created_by'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    driveType: {
      type: DataTypes.ENUM('on-campus', 'off-campus'),
      defaultValue: 'on-campus',
      field: 'drive_type'
    }
  }, {
    sequelize,
    modelName: 'Drive',
  });

  return Drive;
};
