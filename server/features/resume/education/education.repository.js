const { Education } = require('../../../models');

const getEducations = async ({ user_id }) => {
  return await Education.findAll({ where: { userId: user_id } });
};

const addEducation = async ({ user_id, institution, degree, fieldOfStudy, duration, details, cgpa }) => {
  return await Education.create({ userId: user_id, institution, degree, fieldOfStudy, duration, details, cgpa });
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

const getEducationById = async (id) => {
  return await Education.findByPk(id);
};

module.exports = {
  getEducations,
  getEducationById,
  addEducation,
  updateEducation,
  deleteEducation,
};