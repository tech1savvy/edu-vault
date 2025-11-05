const experienceRepository = require('./experience.repository');

const getExperiences = async ({ user_id }) => {
  return experienceRepository.getExperiences({ user_id });
};

const addExperience = async ({ user_id, type, company, role, duration, details }) => {
  return experienceRepository.addExperience({ user_id, type, company, role, duration, details });
};

const updateExperience = async (id, { type, company, role, duration, details }) => {
  return experienceRepository.updateExperience(id, { type, company, role, duration, details });
};

const deleteExperience = async (id) => {
  return experienceRepository.deleteExperience(id);
};

module.exports = {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
};