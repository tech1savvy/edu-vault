const { User } = require('../../models');

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async ({ name, email, password }) => {
  return await User.create({ name, email, password });
};

module.exports = {
  findUserByEmail,
  createUser,
};