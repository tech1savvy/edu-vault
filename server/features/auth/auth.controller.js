const { signup, login } = require("./auth.service");
const logger = require("../../config/logger");

const handleSignup = async (req, res) => {
  try {
    const { user, token } = await signup(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { user, token } = await login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
};
