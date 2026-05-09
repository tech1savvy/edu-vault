"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Interview extends Model {
    static associate(models) {
      Interview.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Interview.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      selectedDomain: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "selected_domain",
      },
      questions: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      percentile: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      strengths: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      weaknesses: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      recommendations: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      analytics: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      timeTaken: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "time_taken",
      },
    },
    {
      sequelize,
      modelName: "Interview",
      tableName: "Interviews",
    }
  );

  return Interview;
};
