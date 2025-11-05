const achievement = require('./achievement.service');

const getAchievements = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await achievement.getAchievements({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching achievements.' });
  }
};

const addAchievement = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await achievement.addAchievement({ ...req.body, user_id });
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await achievement.updateAchievement(id, req.body);
    res.json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    await achievement.deleteAchievement(id);
    res.status(204).send();
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};