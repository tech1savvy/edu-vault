const { User } = require('../../models');
const { getAggregatedResumeData } = require('../resume/resume.aggregator');

const getStudentPublicResume = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await User.findByPk(userId, { attributes: ['id', 'role'] });
    if (!user || user.role !== 'student') {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    const data = await getAggregatedResumeData(userId);
    res.json(data);
  } catch (error) {
    console.error('Public portfolio error:', error);
    res.status(500).json({ error: 'Failed to load portfolio data' });
  }
};

module.exports = {
  getStudentPublicResume,
};
