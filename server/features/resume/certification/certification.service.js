const certificationRepository = require('./certification.repository');

const getCertifications = async ({ user_id }) => {
  return certificationRepository.getCertifications({ user_id });
};

const addCertification = async ({ user_id, name, issuer, date, credentialId }) => {
  return certificationRepository.addCertification({ user_id, name, issuer, date, credentialId });
};

const updateCertification = async (id, { name, issuer, date, credentialId }) => {
  return certificationRepository.updateCertification(id, { name, issuer, date, credentialId });
};

const deleteCertification = async (id) => {
  return certificationRepository.deleteCertification(id);
};

module.exports = {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
};