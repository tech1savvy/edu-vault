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
    // Exclude password field from the user object before sending to client
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
};
