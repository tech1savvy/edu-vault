"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WrittenInterviewSession extends Model {
    static associate(models) {
      WrittenInterviewSession.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  WrittenInterviewSession.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      targetQuestionCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "target_question_count",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
      turns: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      previousQuestions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: "previous_questions",
      },
      lastEvaluation: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "last_evaluation",
      },
      followUpConsumed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "follow_up_consumed",
      },
      finalReport: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "final_report",
      },
      overallScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: "overall_score",
      },
      averageScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: "average_score",
      },
      timeTakenSeconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "time_taken_seconds",
      },
    },
    {
      sequelize,
      modelName: "WrittenInterviewSession",
      tableName: "WrittenInterviewSessions",
    }
  );

  return WrittenInterviewSession;
};
