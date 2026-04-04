const service = require('./analytics.service');

const getDashboard = async (req, res) => {
  try {
    const stats = await service.getDashboardStats();
    const topSkills = await service.getTopSkills(10);
    res.json({ ...stats, topSkills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const stats = await service.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobStats = async (req, res) => {
  try {
    const stats = await service.getJobStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMatchStats = async (req, res) => {
  try {
    const stats = await service.getMatchStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopSkills = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skills = await service.getTopSkills(limit);
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboard,
  getUserStats,
  getJobStats,
  getMatchStats,
  getTopSkills
};
