const educationModel = require('./education.model');

const getEducations = async ({ user_id }) => {
  return educationModel.getEducations({ user_id });
};

const addEducation = async ({ user_id, institution, degree, fieldOfStudy, duration, details }) => {
  return educationModel.addEducation({ user_id, institution, degree, fieldOfStudy, duration, details });
};

const updateEducation = async (id, { institution, degree, fieldOfStudy, duration, details }) => {
  return educationModel.updateEducation(id, { institution, degree, fieldOfStudy, duration, details });
};

const deleteEducation = async (id) => {
  return educationModel.deleteEducation(id);
};

module.exports = {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
};