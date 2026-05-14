'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create Drives table
    await queryInterface.createTable('Drives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('upcoming', 'active', 'closed'),
        defaultValue: 'upcoming'
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      drive_type: {
        type: Sequelize.ENUM('on-campus', 'off-campus'),
        defaultValue: 'on-campus'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 2. Create DriveStages table
    await queryInterface.createTable('DriveStages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      drive_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Drives', key: 'id' },
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sequence_order: {
        type: Sequelize.INTEGER
      },
      scheduled_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      stage_type: {
        type: Sequelize.ENUM('OA', 'Technical', 'HR', 'Final', 'custom'),
        defaultValue: 'custom'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 3. Create ApplicationStages table
    await queryInterface.createTable('ApplicationStages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      application_id: {
        type: Sequelize.INTEGER,
        references: { model: 'JobApplications', key: 'id' },
        onDelete: 'CASCADE'
      },
      stage_id: {
        type: Sequelize.INTEGER,
        references: { model: 'DriveStages', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'shortlisted', 'eliminated'),
        defaultValue: 'pending'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 4. Create Notifications table
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('stage_update', 'elimination', 'selection', 'general'),
        defaultValue: 'general'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      related_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 5. Add drive_id and eligibility columns to JobDescriptions
    await queryInterface.addColumn('JobDescriptions', 'drive_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Drives', key: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('JobDescriptions', 'min_cgpa', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('JobDescriptions', 'required_skills', {
      type: Sequelize.JSONB,
      allowNull: true
    });

    await queryInterface.addColumn('JobDescriptions', 'eligible_branches', {
      type: Sequelize.JSONB,
      allowNull: true
    });

    await queryInterface.addColumn('JobDescriptions', 'eligibility_notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // 6. Add current_stage_id to JobApplications
    await queryInterface.addColumn('JobApplications', 'current_stage_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'DriveStages', key: 'id' },
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('JobApplications', 'current_stage_id');
    await queryInterface.removeColumn('JobDescriptions', 'eligibility_notes');
    await queryInterface.removeColumn('JobDescriptions', 'eligible_branches');
    await queryInterface.removeColumn('JobDescriptions', 'required_skills');
    await queryInterface.removeColumn('JobDescriptions', 'min_cgpa');
    await queryInterface.removeColumn('JobDescriptions', 'drive_id');
    await queryInterface.dropTable('Notifications');
    await queryInterface.dropTable('ApplicationStages');
    await queryInterface.dropTable('DriveStages');
    await queryInterface.dropTable('Drives');
  }
};
