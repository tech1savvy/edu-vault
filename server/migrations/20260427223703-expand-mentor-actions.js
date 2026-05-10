'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('MentorActions', 'priority', {
      type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
      defaultValue: 'MEDIUM'
    });

    await queryInterface.addColumn('MentorActions', 'studentNote', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('MentorActions', 'mentorFeedback', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('MentorActions', 'priority');
    await queryInterface.removeColumn('MentorActions', 'studentNote');
    await queryInterface.removeColumn('MentorActions', 'mentorFeedback');
    
    // Remove the ENUM type from Postgres
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_MentorActions_priority";');
  }
};
