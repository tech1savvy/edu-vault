"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Interviews", {
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
      selected_domain: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      questions: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      answers: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      percentile: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      strengths: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      weaknesses: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      recommendations: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      analytics: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      time_taken: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    await queryInterface.addIndex("Interviews", ["user_id"]);
    await queryInterface.addIndex("Interviews", ["selected_domain"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Interviews");
  },
};
