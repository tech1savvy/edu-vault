const { Education } = require('../../../models');
const { resolveUserId } = require('../resolveUserId');

const getEducations = async (params) => {
  const userId = resolveUserId(params);
  return await Education.findAll({ where: { userId } });
};

const addEducation = async (params) => {
  const userId = resolveUserId(params);
  const { institution, degree, fieldOfStudy, duration, details } = params;
  return await Education.create({ userId, institution, degree, fieldOfStudy, duration, details });
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