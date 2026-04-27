const express = require('express');
const router = express.Router();
const mlClient = require('../ml/ml.client');
const jobDescriptionRepository = require('../job-description/jobDescription.repository');
const { getAggregatedResumeText, getAllResumesForSync } = require('../resume/resume.aggregator');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');
const logger = require('../../config/logger');

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
    logger.error('Error syncing resume:', error);
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
    logger.error('Error syncing job description:', error);
    res.status(500).json({ error: 'Failed to sync job description' });
  }
};

const syncAll = async (req, res) => {
  try {
    const BATCH_SIZE = 50;

    const resumes = await getAllResumesForSync();
    const jobs = await jobDescriptionRepository.findAllForSync();

    let totalSyncedResumes = 0;
    let totalSyncedJobs = 0;
    let failedResumes = [];
    let failedJobs = [];

    for (let i = 0; i < resumes.length; i += BATCH_SIZE) {
      const batch = resumes.slice(i, i + BATCH_SIZE);
      const result = await mlClient.syncBatch(batch, []);
      totalSyncedResumes += result.synced_resumes;
      failedResumes = failedResumes.concat(result.failed_resumes);
    }

    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);
      const result = await mlClient.syncBatch([], batch);
      totalSyncedJobs += result.synced_jobs;
      failedJobs = failedJobs.concat(result.failed_jobs);
    }

    res.json({
      status: 'ok',
      message: `Synced ${totalSyncedResumes} resumes and ${totalSyncedJobs} job descriptions`,
      synced_resumes: totalSyncedResumes,
      failed_resumes: failedResumes,
      synced_jobs: totalSyncedJobs,
      failed_jobs: failedJobs,
    });
  } catch (error) {
    logger.error('Error triggering full sync:', error);
    res.status(500).json({ error: 'Failed to trigger full sync' });
  }
};

router.post('/resume/:userId', authenticateToken, syncResume);
router.post('/resume', authenticateToken, syncResume);
router.post('/job/:jobId', authenticateToken, authorizeRoles('administrator'), syncJobDescription);
router.post('/job', authenticateToken, authorizeRoles('administrator'), syncJobDescription);
router.post('/all', authenticateToken, authorizeRoles('administrator'), syncAll);

module.exports = router;
