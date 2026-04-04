const service = require('./jobApplications.service');
const authenticateToken = require('../../middleware/auth');

const getByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await service.getApplicationsByJob(jobId);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const apply = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;
    const application = await service.applyToJob(jobId, userId);
    res.status(201).json(application);
  } catch (error) {
    if (error.message === 'You have already applied to this job') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const updateStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    const application = await service.updateApplicationStatus(applicationId, status, notes);
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCounts = async (req, res) => {
  try {
    const { jobId } = req.params;
    const counts = await service.getApplicationCounts(jobId);
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getByJob,
  apply,
  updateStatus,
  getCounts
};
