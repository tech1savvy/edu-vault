const { Heading } = require('../../../models');
const { resolveUserId } = require('../resolveUserId');

const getHeading = async (params) => {
  const userId = resolveUserId(params);
  return await Heading.findOne({ where: { userId } });
};

const createOrUpdateHeading = async ({ user_id, userId, name, role, email, phone, location, link, description }) => {
  const uid = resolveUserId({ user_id, userId });
  const [heading, created] = await Heading.findOrCreate({
    where: { userId: uid },
    defaults: { userId: uid, name, role, email, phone, location, link, description },
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