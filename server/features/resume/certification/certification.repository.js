const { Certification } = require('../../../models');
const { resolveUserId } = require('../resolveUserId');

const getCertifications = async (params) => {
  const userId = resolveUserId(params);
  return await Certification.findAll({ where: { userId } });
};

const addCertification = async (params) => {
  const userId = resolveUserId(params);
  const { name, issuer, date, credentialId } = params;
  return await Certification.create({ userId, name, issuer, date, credentialId });
};

const updateCertification = async (id, { name, issuer, date, credentialId }) => {
  const certification = await Certification.findByPk(id);
  if (!certification) {
    throw new Error('Certification not found');
  }
  return await certification.update({ name, issuer, date, credentialId });
};

const deleteCertification = async (id) => {
  const certification = await Certification.findByPk(id);
  if (!certification) {
    throw new Error('Certification not found');
  }
  return await certification.destroy();
};

const getCertificationById = async (id) => {
  return await Certification.findByPk(id);
};

module.exports = {
  getCertifications,
  getCertificationById,
  addCertification,
  updateCertification,
  deleteCertification,
};