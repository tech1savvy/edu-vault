const education = require('./education.service');

const getEducations = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await education.getEducations({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching educations.' });
  }
};

const addEducation = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await education.addEducation({ ...req.body, user_id });
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await education.updateEducation(id, req.body);
    res.json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    await education.deleteEducation(id);
    res.status(204).send();
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
};