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

const { Op } = require('sequelize');

const getHeadingsByUserIds = async (userIds) => {
  return await Heading.findAll({
    where: {
      userId: {
        [Op.in]: userIds,
      },
    },
  });
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
  getHeadingsByUserIds,
};