const { User } = require('../../models');
const { Op } = require('sequelize');

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async ({ name, email, password }) => {
  return await User.create({ name, email, password });
};

const { Op } = require('sequelize');

const getUsersByIds = async (ids) => {
  return await User.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
};

module.exports = {
  findUserByEmail,
  createUser,
  getUsersByIds,
};