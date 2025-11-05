const { User } = require('../../models');

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async ({ email, password }) => {
  return await User.create({ email, password });
};

module.exports = {
  findUserByEmail,
  createUser,
};