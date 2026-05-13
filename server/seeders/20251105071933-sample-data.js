'use strict';
const bcrypt = require('bcrypt');
const adminUser = require('./data/admin');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = [];

    for (let i = 1; i <= 10; i++) {
      users.push({
        name: `Test Student ${i}`,
        email: `student${i}@example.com`,
        password: hashedPassword,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    users.push({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
