const { getAggregatedResumeData } = require('./resume.aggregator');

const getFullResume = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: 'Invalid user id in token' });
    }
    const resumeData = await getAggregatedResumeData(userId);
    res.json(resumeData);
  } catch (error) {
    console.error('Error fetching full resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume data' });
  }
};

module.exports = {
  getFullResume,
};
