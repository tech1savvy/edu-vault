const educationRepository = require('./education.repository');
const { SyncService } = require('../../ml/sync.service');

const getEducations = async ({ user_id }) => {
  return educationRepository.getEducations({ user_id });
};

const addEducation = async ({ user_id, institution, degree, fieldOfStudy, duration, details }) => {
  const education = await educationRepository.addEducation({ user_id, institution, degree, fieldOfStudy, duration, details });
  SyncService.syncResume(user_id);
  return education;
};

const updateEducation = async (id, { institution, degree, fieldOfStudy, duration, details }) => {
  const education = await educationRepository.updateEducation(id, { institution, degree, fieldOfStudy, duration, details });
  if (education) {
    SyncService.syncResume(education.userId);
  }
  return education;
};

const deleteEducation = async (id) => {
  const education = await educationRepository.getEducationById(id);
  if (education) {
    await educationRepository.deleteEducation(id);
    SyncService.syncResume(education.userId);
  }
};

module.exports = {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
};