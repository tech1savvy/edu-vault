const skill = require('./skill.service');

const getSkills = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await skill.getSkills({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching skills.' });
  }
};

const addSkill = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await skill.addSkill({ ...req.body, user_id });
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await skill.updateSkill(id, req.body);
    res.json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await skill.deleteSkill(id);
    res.status(204).send();
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};