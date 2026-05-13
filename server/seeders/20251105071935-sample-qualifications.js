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

    const projects = [];
    const skills = [];
    const achievements = [];
    const certifications = [];

    for (let i = 0; i < students.length; i++) {
      const userId = students[i].id;
      const profile = jobProfiles[i];

      projects.push({
        userId,
        ...profile.project,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      for (const skill of profile.skills) {
        skills.push({
          userId,
          name: skill.name,
          level: skill.level,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      achievements.push({
        userId,
        ...profile.achievement,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      certifications.push({
        userId,
        ...profile.certification,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const { Project, Skill, Achievement, Certification } = require('../models');
    await Project.bulkCreate(projects);
    await Skill.bulkCreate(skills);
    await Achievement.bulkCreate(achievements);
    await Certification.bulkCreate(certifications);
  },

  async down () {
    const { Project, Skill, Achievement, Certification } = require('../models');
    await Project.destroy({ where: {}, truncate: true });
    await Skill.destroy({ where: {}, truncate: true });
    await Achievement.destroy({ where: {}, truncate: true });
    await Certification.destroy({ where: {}, truncate: true });
  }
};
