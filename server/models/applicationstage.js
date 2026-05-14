'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApplicationStage extends Model {
    static associate(models) {
      ApplicationStage.belongsTo(models.JobApplication, { foreignKey: 'applicationId', as: 'application' });
      ApplicationStage.belongsTo(models.DriveStage, { foreignKey: 'stageId', as: 'stage' });
      ApplicationStage.belongsTo(models.User, { foreignKey: 'updatedBy', as: 'updater' });
    }
  }

  ApplicationStage.init({
    applicationId: {
      type: DataTypes.INTEGER,
      field: 'application_id'
    },
    stageId: {
      type: DataTypes.INTEGER,
      field: 'stage_id'
    },
    status: {
      type: DataTypes.ENUM('pending', 'shortlisted', 'eliminated'),
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      field: 'updated_by'
    }
  }, {
    sequelize,
    modelName: 'ApplicationStage',
    timestamps: true
  });

  return ApplicationStage;
};
