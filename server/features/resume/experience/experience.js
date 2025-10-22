const experienceModel = require('./experience.model');

const getExperiences = async ({ user_id }) => {
  return experienceModel.getExperiences({ user_id });
};

const addExperience = async ({ user_id, type, company, role, duration, details }) => {
  return experienceModel.addExperience({ user_id, type, company, role, duration, details });
};

const updateExperience = async (id, { type, company, role, duration, details }) => {
  return experienceModel.updateExperience(id, { type, company, role, duration, details });
};

const deleteExperience = async (id) => {
  return experienceModel.deleteExperience(id);
};

module.exports = {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
};