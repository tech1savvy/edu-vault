const { User } = require('../../models');
const { Op } = require('sequelize');

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async ({ name, email, password, securityQuestion, securityAnswer }) => {
  return await User.create({ name, email, password, securityQuestion, securityAnswer });
};

const setResetTokenForEmail = async ({ email, resetToken, resetTokenExpiry }) => {
  return await User.update(
    { resetToken, resetTokenExpiry },
    { where: { email } }
  );
};

const findUserByResetToken = async (resetToken) => {
  return await User.findOne({ where: { resetToken } });
};

const updatePasswordByResetToken = async ({ resetToken, password }) => {
  return await User.update(
    { password, resetToken: null, resetTokenExpiry: null },
    { where: { resetToken } }
  );
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
  setResetTokenForEmail,
  findUserByResetToken,
  updatePasswordByResetToken,
  getUsersByIds,
  findAll,
};