const { Experience } = require('../../../models');
const { resolveUserId } = require('../resolveUserId');

const getExperiences = async (params) => {
  const userId = resolveUserId(params);
  return await Experience.findAll({ where: { userId } });
};

const getExperienceById = async (id) => {
  return await Experience.findByPk(id);
};

const addExperience = async (params) => {
  const userId = resolveUserId(params);
  const { type, company, role, duration, details } = params;
  return await Experience.create({ userId, type, company, role, duration, details });
};

const updateExperience = async (id, { type, company, role, duration, details }) => {
  const experience = await Experience.findByPk(id);
  if (!experience) {
    throw new Error('Experience not found');
  }
  return await experience.update({ type, company, role, duration, details });
};

const deleteExperience = async (id) => {
  const experience = await Experience.findByPk(id);
  if (!experience) {
    throw new Error('Experience not found');
  }
  return await experience.destroy();
};

module.exports = {
  getExperiences,
  getExperienceById,
  addExperience,
  updateExperience,
  deleteExperience,
};