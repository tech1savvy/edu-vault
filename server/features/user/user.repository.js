const { User } = require('../../models');
const { Op } = require('sequelize');

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async ({ name, email, password }) => {
  return await User.create({ name, email, password });
};

const getUsersByIds = async (ids) => {
  return await User.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
};

const findAll = async () => {
  return await User.findAll();
};

module.exports = {
  findUserByEmail,
  createUser,
  getUsersByIds,
  findAll,
};