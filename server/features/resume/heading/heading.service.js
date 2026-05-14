const headingRepository = require('./heading.repository');
const { SyncService } = require('../../ml/sync.service');

const getHeading = async ({ user_id }) => {
  return headingRepository.getHeading({ user_id });
};

const createOrUpdateHeading = async (data) => {
  const { user_id, name, title, contact, linkedin, github, website } = data;
  const mappedData = {
    user_id,
    name: name || "",
    role: title || "",
    email: contact || "",
    phone: "",
    location: "",
    link: linkedin || github || website || ""
  };
  const heading = await headingRepository.createOrUpdateHeading(mappedData);
  SyncService.syncResume(user_id);
  return heading;
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
};