const { Experience } = require('../../../models');

const getExperiences = async ({ user_id }) => {
  return await Experience.findAll({ where: { user_id } });
};

const addExperience = async ({ user_id, type, company, role, duration, details }) => {
  return await Experience.create({ user_id, type, company, role, duration, details });
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
  addExperience,
  updateExperience,
  deleteExperience,
};