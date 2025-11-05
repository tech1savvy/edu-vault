const { Education } = require('../../../models');

const getEducations = async ({ user_id }) => {
  return await Education.findAll({ where: { user_id } });
};

const addEducation = async ({ user_id, institution, degree, fieldOfStudy, duration, details }) => {
  return await Education.create({ user_id, institution, degree, fieldOfStudy, duration, details });
};

const updateEducation = async (id, { institution, degree, fieldOfStudy, duration, details }) => {
  const education = await Education.findByPk(id);
  if (!education) {
    throw new Error('Education not found');
  }
  return await education.update({ institution, degree, fieldOfStudy, duration, details });
};

const deleteEducation = async (id) => {
  const education = await Education.findByPk(id);
  if (!education) {
    throw new Error('Education not found');
  }
  return await education.destroy();
};

module.exports = {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
};