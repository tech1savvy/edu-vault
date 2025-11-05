const experience = require('./experience.service');

const getExperiences = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await experience.getExperiences({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching experiences.' });
  }
};

const addExperience = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await experience.addExperience({ ...req.body, user_id });
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await experience.updateExperience(id, req.body);
    res.json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    await experience.deleteExperience(id);
    res.status(204).send();
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
};