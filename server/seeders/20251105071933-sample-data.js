'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = await queryInterface.bulkInsert('Users', [{
      name: 'Test Student',
      email: 'student@example.com',
      password: hashedPassword,
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Test Student 2',
      email: 'student2@example.com',
      password: hashedPassword,
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Test Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: ['id'] });

    const student1Id = users[0].id;
    const student2Id = users[1].id;

    await queryInterface.bulkInsert('Headings', [{
      user_id: student1Id,
      name: 'John Doe',
      role: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      location: 'New York, USA',
      link: 'linkedin.com/in/johndoe',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      user_id: student2Id,
      name: 'Jane Smith',
      role: 'Data Scientist',
      email: 'jane.smith@example.com',
      phone: '098-765-4321',
      location: 'San Francisco, USA',
      link: 'linkedin.com/in/janesmith',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Experiences', [{
      user_id: student1Id,
      type: 'Full-time',
      company: 'Google',
      role: 'Software Engineer',
      duration: '2020-Present',
      details: 'Developed and maintained various software.',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Educations', [{
      user_id: student1Id,
      institution: 'University of XYZ',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      duration: '2018-2020',
      details: 'Specialized in AI and Machine Learning.',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Projects', [{
      user_id: student1Id,
      title: 'EduVault',
      description: 'A platform for managing educational records.',
      techStack: 'Node.js, Express, PostgreSQL, React',
      timeline: '2023-Present',
      type: 'Web Application',
      collaborators: 'Jane Doe',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Skills', [{
      user_id: student1Id,
      name: 'JavaScript',
      level: 'Expert',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      user_id: student2Id,
      name: 'Python',
      level: 'Expert',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Achievements', [{
      user_id: student1Id,
      title: 'Award for Innovation',
      description: 'Received an award for innovative project design.',
      date: '2022',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Certifications', [{
      user_id: student1Id,
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2021',
      credentialId: 'ABC123XYZ',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Headings', null, {});
    await queryInterface.bulkDelete('Experiences', null, {});
    await queryInterface.bulkDelete('Educations', null, {});
    await queryInterface.bulkDelete('Projects', null, {});
    await queryInterface.bulkDelete('Skills', null, {});
    await queryInterface.bulkDelete('Achievements', null, {});
    await queryInterface.bulkDelete('Certifications', null, {});
  }
};