const { Heading } = require('../../../models');

const getHeading = async ({ user_id }) => {
  return await Heading.findOne({ where: { user_id } });
};

const createOrUpdateHeading = async ({ user_id, name, role, email, phone, location, link }) => {
  const [heading, created] = await Heading.findOrCreate({
    where: { user_id },
    defaults: { user_id, name, role, email, phone, location, link },
  });

  if (!created) {
    return await heading.update({ name, role, email, phone, location, link });
  }

  return heading;
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
};