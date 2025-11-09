const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../user/user.repository');

const signup = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ name, email, password: hashedPassword });
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
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
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};

module.exports = {
  signup,
  login,
};
