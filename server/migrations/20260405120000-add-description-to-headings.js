'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'Headings';
    const desc = await queryInterface.describeTable(table);
    if (!desc.description) {
      await queryInterface.addColumn(table, 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = 'Headings';
    const desc = await queryInterface.describeTable(table);
    if (desc.description) {
      await queryInterface.removeColumn(table, 'description');
    }
  },
};
