'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    });
    await queryInterface.addColumn('Users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'status');
    await queryInterface.removeColumn('Users', 'last_login');
  }
};
