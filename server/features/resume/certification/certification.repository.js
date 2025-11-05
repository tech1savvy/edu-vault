const { Certification } = require('../../../models');

const getCertifications = async ({ user_id }) => {
  return await Certification.findAll({ where: { user_id } });
};

const addCertification = async ({ user_id, name, issuer, date, credentialId }) => {
  return await Certification.create({ user_id, name, issuer, date, credentialId });
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

module.exports = {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
};