const certificationModel = require('./certification.model');

const getCertifications = async ({ user_id }) => {
  return certificationModel.getCertifications({ user_id });
};

const addCertification = async ({ user_id, name, issuer, date, credentialId }) => {
  return certificationModel.addCertification({ user_id, name, issuer, date, credentialId });
};

const updateCertification = async (id, { name, issuer, date, credentialId }) => {
  return certificationModel.updateCertification(id, { name, issuer, date, credentialId });
};

const deleteCertification = async (id) => {
  return certificationModel.deleteCertification(id);
};

module.exports = {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
};