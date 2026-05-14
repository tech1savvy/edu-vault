const { Heading } = require('../../../models');

const getHeading = async ({ user_id }) => {
  return await Heading.findOne({ where: { userId: user_id } });
};

const createOrUpdateHeading = async ({ user_id, name, role, email, phone, location, link, description }) => {
  const [heading, created] = await Heading.findOrCreate({
    where: { userId: user_id },
    defaults: { userId: user_id, name, role, email, phone, location, link, description },
  });

  if (!created) {
    return await heading.update({ name, role, email, phone, location, link, description });
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
