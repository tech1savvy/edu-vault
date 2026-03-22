const { getAggregatedResumeText } = require('../resume/resume.aggregator.js');
const mlClient = require('./ml.client');
const logger = require('../../config/logger');

const syncResume = async (userId) => {
  try {
    const resumeText = await getAggregatedResumeText(userId);
    if (!resumeText) {
      return;
    }
    await mlClient.syncResume(userId, resumeText);
    logger.info(`Synced resume for user: ${userId}`);
  } catch (error) {
    logger.error(`Error syncing resume for user ${userId}:`, { message: error.message, stack: error.stack });
  }
};

const syncJobDescription = async (jobDescription) => {
  try {
    const jobText = `${jobDescription.title}\n${jobDescription.description}\n${jobDescription.requirements}`;
    await mlClient.syncJob(jobDescription.id, jobText);
    logger.info(`Synced job: ${jobDescription.id}`);
  } catch (error) {
    logger.error(`Error syncing job ${jobDescription.id}:`, { message: error.message, stack: error.stack });
  }
};

const SyncService = {
  syncResume,
  syncJobDescription,
};

module.exports = { SyncService };
