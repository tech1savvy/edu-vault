const express = require('express');
const router = express.Router();
const mlClient = require('../ml/ml.client');
const userRepository = require('../user/user.repository');
const jobDescriptionRepository = require('../job-description/jobDescription.repository');
const { getAggregatedResumeText } = require('../resume/resume.aggregator');

const syncResume = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const resumeText = await getAggregatedResumeText(parseInt(userId));
    if (!resumeText) {
      return res.status(404).json({ error: 'Resume not found for user' });
    }
    
    const result = await mlClient.syncResume(parseInt(userId), resumeText);
    res.json(result);
  } catch (error) {
    console.error('Error syncing resume:', error);
    res.status(500).json({ error: 'Failed to sync resume' });
  }
};

const syncJobDescription = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.body.jobId;
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }
    
    const job = await jobDescriptionRepository.findById(parseInt(jobId));
    if (!job) {
      return res.status(404).json({ error: 'Job description not found' });
    }
    
    const jobText = `${job.title}\n${job.description}\n${job.requirements}`;
    const result = await mlClient.syncJob(parseInt(jobId), jobText);
    res.json(result);
  } catch (error) {
    console.error('Error syncing job description:', error);
    res.status(500).json({ error: 'Failed to sync job description' });
  }
};

const syncAll = async (req, res) => {
  try {
    const result = await mlClient.syncAll();
    res.json(result);
  } catch (error) {
    console.error('Error triggering full sync:', error);
    res.status(500).json({ error: 'Failed to trigger full sync' });
  }
};

router.post('/resume/:userId', syncResume);
router.post('/resume', syncResume);
router.post('/job/:jobId', syncJobDescription);
router.post('/job', syncJobDescription);
router.post('/all', syncAll);

module.exports = router;
