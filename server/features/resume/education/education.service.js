const educationRepository = require('./education.repository');

const getEducations = async ({ user_id }) => {
  return educationRepository.getEducations({ user_id });
};

const addEducation = async ({ user_id, institution, degree, fieldOfStudy, duration, details }) => {
  return educationRepository.addEducation({ user_id, institution, degree, fieldOfStudy, duration, details });
};

const updateEducation = async (id, { institution, degree, fieldOfStudy, duration, details }) => {
  return educationRepository.updateEducation(id, { institution, degree, fieldOfStudy, duration, details });
};

const deleteEducation = async (id) => {
  return educationRepository.deleteEducation(id);
};

module.exports = {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
};