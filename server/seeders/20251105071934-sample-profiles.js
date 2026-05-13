'use strict';
const jobProfiles = require('./data/profiles');
const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up () {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id'],
      order: [['id', 'ASC']]
    });

    const headings = [];
    const experiences = [];
    const educations = [];

    for (let i = 0; i < students.length; i++) {
      const userId = students[i].id;
      const profile = jobProfiles[i];

      headings.push({
        user_id: userId,
        name: profile.name,
        role: profile.role,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        link: profile.link,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      experiences.push({
        user_id: userId,
        ...profile.experience,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      educations.push({
        user_id: userId,
        ...profile.education,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const { Heading, Experience, Education } = require('../models');
    await Heading.bulkCreate(headings);
    await Experience.bulkCreate(experiences);
    await Education.bulkCreate(educations);
  },

  async down () {
    const { Heading, Experience, Education } = require('../models');
    await Heading.destroy({ where: {}, truncate: true });
    await Experience.destroy({ where: {}, truncate: true });
    await Education.destroy({ where: {}, truncate: true });
  }
};
