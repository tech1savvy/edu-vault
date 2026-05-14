const headingRepository = require('./heading.repository');
const { SyncService } = require('../../ml/sync.service');

const getHeading = async ({ user_id }) => {
  return headingRepository.getHeading({ user_id });
};

const createOrUpdateHeading = async ({ user_id, name, role, email, phone, location, link, description }) => {
  const heading = await headingRepository.createOrUpdateHeading({ user_id, name, role, email, phone, location, link, description });
  SyncService.syncResume(user_id);
  return heading;
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
};
