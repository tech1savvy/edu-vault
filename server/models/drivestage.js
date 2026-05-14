'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DriveStage extends Model {
    static associate(models) {
      DriveStage.belongsTo(models.Drive, { foreignKey: 'driveId', as: 'drive' });
    }
  }

  DriveStage.init({
    driveId: {
      type: DataTypes.INTEGER,
      field: 'drive_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sequenceOrder: {
      type: DataTypes.INTEGER,
      field: 'sequence_order'
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'scheduled_date'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stageType: {
      type: DataTypes.ENUM('OA', 'Technical', 'HR', 'Final', 'custom'),
      defaultValue: 'custom',
      field: 'stage_type'
    }
  }, {
    sequelize,
    modelName: 'DriveStage',
  });

  return DriveStage;
};
