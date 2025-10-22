const bcrypt = require('bcrypt');
const userModel = require('../user/user.model');

const signup = async ({ email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ email, password: hashedPassword });
  return user;
};

const login = async ({ email, password }) => {
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  return user;
};

module.exports = {
  signup,
  login,
};
