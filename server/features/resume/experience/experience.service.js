const experienceRepository = require('./experience.repository');
const { SyncService } = require('../../ml/sync.service');

const getExperiences = async ({ user_id }) => {
  return experienceRepository.getExperiences({ user_id });
};

const addExperience = async ({ user_id, type, company, role, duration, details }) => {
  const newExperience = await experienceRepository.addExperience({ user_id, type, company, role, duration, details });
  // Do not await, let it run in the background
  SyncService.syncResume(user_id);
  return newExperience;
};

const updateExperience = async (id, { type, company, role, duration, details }) => {
  const updatedExperience = await experienceRepository.updateExperience(id, { type, company, role, duration, details });
  if (updatedExperience) {
    // Do not await, let it run in the background
    SyncService.syncResume(updatedExperience.userId);
  }
  return updatedExperience;
};

const deleteExperience = async (id) => {
  const experience = await experienceRepository.getExperienceById(id);
  if (experience) {
    await experienceRepository.deleteExperience(id);
    // Do not await, let it run in the background
    SyncService.syncResume(experience.userId);
  }
};

module.exports = {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
};