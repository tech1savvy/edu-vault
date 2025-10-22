const { signup, login } = require('./auth');

const handleSignup = async (req, res) => {
  try {
    const user = await signup(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    const user = await login(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
};

