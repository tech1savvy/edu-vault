const headingRepository = require('./heading.repository');

const getHeading = async ({ user_id }) => {
  return headingRepository.getHeading({ user_id });
};

const createOrUpdateHeading = async ({ user_id, name, role, email, phone, location, link }) => {
  return headingRepository.createOrUpdateHeading({ user_id, name, role, email, phone, location, link });
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
};