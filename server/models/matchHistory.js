'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MatchHistory extends Model {
    static associate(models) {
      MatchHistory.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      MatchHistory.belongsTo(models.JobDescription, { foreignKey: 'jobId', as: 'job' });
    }
  }

  MatchHistory.init({
    jobId: {
      type: DataTypes.INTEGER,
      field: 'job_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    matchScore: {
      type: DataTypes.FLOAT,
      field: 'match_score'
    },
    matchedAt: {
      type: DataTypes.DATE,
      field: 'matched_at'
    }
  }, {
    sequelize,
    modelName: 'MatchHistory',
    tableName: 'MatchHistories',
    timestamps: true
  });

  return MatchHistory;
};
