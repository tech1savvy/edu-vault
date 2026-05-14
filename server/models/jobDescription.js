'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JobDescription extends Model {
    static associate(models) {
      JobDescription.belongsTo(models.Drive, { foreignKey: 'driveId', as: 'drive' });
      JobDescription.hasMany(models.JobApplication, { foreignKey: 'jobId', as: 'applications' });
    }
  }

  JobDescription.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    requirements: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('draft', 'active', 'archived', 'closed'),
      defaultValue: 'draft'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at'
    },
    driveId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'drive_id'
    },
    minCgpa: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'min_cgpa'
    },
    requiredSkills: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'required_skills'
    },
    eligibleBranches: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'eligible_branches'
    },
    eligibilityNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'eligibility_notes'
    }
  }, {
    sequelize,
    modelName: 'JobDescription',
  });

  return JobDescription;
};