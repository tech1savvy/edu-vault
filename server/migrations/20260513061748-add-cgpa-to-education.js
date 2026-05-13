'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Educations', 'cgpa', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Educations', 'cgpa');
  }
};
