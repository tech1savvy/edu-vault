const headingModel = require('./heading.model');

const getHeading = async ({ user_id }) => {
  return headingModel.getHeading({ user_id });
};

const createOrUpdateHeading = async ({ user_id, name, role, email, phone, location, link }) => {
  return headingModel.createOrUpdateHeading({ user_id, name, role, email, phone, location, link });
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
};