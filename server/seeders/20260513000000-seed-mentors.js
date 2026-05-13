'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const mentors = [
      { name: 'Mentor1', email: 'mentor1@example.com' },
      { name: 'Mentor2', email: 'mentor2@example.com' },
      { name: 'Mentor3', email: 'mentor3@example.com' },
    ];

    for (const mentor of mentors) {
      const existing = await queryInterface.sequelize.query(
        `SELECT id FROM "Users" WHERE email = :email LIMIT 1;`,
        { replacements: { email: mentor.email }, type: Sequelize.QueryTypes.SELECT }
      );
      if (existing.length > 0) {
        // Always update password to ensure it's correct
        await queryInterface.sequelize.query(
          `UPDATE "Users" SET password = :password, "updatedAt" = NOW() WHERE email = :email;`,
          { replacements: { password: hashedPassword, email: mentor.email } }
        );
        console.log(`Updated password for ${mentor.email}`);
      } else {
        await queryInterface.bulkInsert('Users', [{
          name: mentor.name,
          email: mentor.email,
          password: hashedPassword,
          role: 'mentor',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        }]);
        console.log(`Created ${mentor.email}`);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'mentor' }, {});
  },
};
