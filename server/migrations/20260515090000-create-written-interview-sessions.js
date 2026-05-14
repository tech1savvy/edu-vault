"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WrittenInterviewSessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      target_question_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "active",
      },
      turns: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      previous_questions: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      last_evaluation: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      follow_up_consumed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      final_report: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      overall_score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      average_score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      time_taken_seconds: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("WrittenInterviewSessions", ["user_id"]);
    await queryInterface.addIndex("WrittenInterviewSessions", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("WrittenInterviewSessions");
  },
};
