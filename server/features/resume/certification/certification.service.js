const certificationRepository = require('./certification.repository');
const { SyncService } = require('../../ml/sync.service');

const getCertifications = async ({ user_id }) => {
  return certificationRepository.getCertifications({ user_id });
};

const addCertification = async ({ user_id, name, issuer, date, credentialId }) => {
  const certification = await certificationRepository.addCertification({ user_id, name, issuer, date, credentialId });
  SyncService.syncResume(user_id);
  return certification;
};

const updateCertification = async (id, { name, issuer, date, credentialId }) => {
  const certification = await certificationRepository.updateCertification(id, { name, issuer, date, credentialId });
  if (certification) {
    SyncService.syncResume(certification.userId);
  }
  return certification;
};

const deleteCertification = async (id) => {
  const certification = await certificationRepository.getCertificationById(id);
  if (certification) {
    await certificationRepository.deleteCertification(id);
    SyncService.syncResume(certification.userId);
  }
};

module.exports = {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
};