'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns to JobDescriptions
    await queryInterface.addColumn('JobDescriptions', 'status', {
      type: Sequelize.ENUM('draft', 'active', 'archived', 'closed'),
      defaultValue: 'draft'
    });
    await queryInterface.addColumn('JobDescriptions', 'category', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('JobDescriptions', 'expires_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Create JobApplications table
    await queryInterface.createTable('JobApplications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobId: {
        type: Sequelize.INTEGER,
        field: 'job_id',
        references: {
          model: 'JobDescriptions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'reviewed', 'shortlisted', 'rejected'),
        defaultValue: 'pending'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      appliedAt: {
        type: Sequelize.DATE,
        field: 'applied_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addConstraint('JobApplications', {
      fields: ['job_id', 'user_id'],
      type: 'unique',
      name: 'unique_job_user_application'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('JobApplications', 'unique_job_user_application');
    await queryInterface.dropTable('JobApplications');
    await queryInterface.removeColumn('JobDescriptions', 'expires_at');
    await queryInterface.removeColumn('JobDescriptions', 'category');
    await queryInterface.removeColumn('JobDescriptions', 'status');
  }
};
