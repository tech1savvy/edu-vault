'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JobApplication extends Model {
    static associate(models) {
      JobApplication.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      JobApplication.belongsTo(models.JobDescription, { foreignKey: 'jobId', as: 'job' });
    }
  }

  JobApplication.init({
    jobId: {
      type: DataTypes.INTEGER,
      field: 'job_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'rejected'),
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    appliedAt: {
      type: DataTypes.DATE,
      field: 'applied_at'
    }
  }, {
    sequelize,
    modelName: 'JobApplication',
    tableName: 'JobApplications',
    timestamps: true
  });

  return JobApplication;
};
