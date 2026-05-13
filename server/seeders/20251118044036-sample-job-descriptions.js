'use strict';
const jobDescriptions = require('./data/job-descriptions');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const records = jobDescriptions.map(jd => ({
      ...jd,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('JobDescriptions', records, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('JobDescriptions', null, {});
  }
};
