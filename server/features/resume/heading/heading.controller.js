const heading = require('./heading.service');

const getHeading = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await heading.getHeading({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching heading.' });
  }
};

const createOrUpdateHeading = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await heading.createOrUpdateHeading({ ...req.body, user_id });
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
};