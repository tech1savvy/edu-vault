const { getAggregatedResumeText } = require('../resume/resume.aggregator.js');
const EmbeddingService = require('./embedding.service');
const PineconeService = require('./pinecone.service');
const logger = require('../../config/logger');
const userRepository = require('../user/user.repository');
const jobDescriptionRepository = require('../job-description/jobDescription.repository');

const syncResume = async (userId) => {
  try {
    const resumeText = await getAggregatedResumeText(userId);
    if (!resumeText) {
      // Potentially delete the vector if the resume is empty
      return;
    }
    
    const embedding = await EmbeddingService.generateEmbedding(resumeText);
    
    const vector = {
      id: `user-${userId}`,
      values: embedding,
      metadata: {
        type: 'resume',
        userId,
      },
    };

    await PineconeService.upsert([vector]);
    logger.info(`Successfully synced resume for user: ${userId}`);
  } catch (error) {
    logger.error(`Error syncing resume for user ${userId}:`, { message: error.message, stack: error.stack });
  }
};

const syncJobDescription = async (jobDescription) => {
  try {
    const jobText = `${jobDescription.title}\n${jobDescription.description}\n${jobDescription.requirements}`;
    const embedding = await EmbeddingService.generateEmbedding(jobText);

    const vector = {
      id: `job-${jobDescription.id}`,
      values: embedding,
      metadata: {
        type: 'job',
        jobId: jobDescription.id,
      },
    };

    await PineconeService.upsert([vector]);
    logger.info(`Successfully synced job description for job: ${jobDescription.id}`);
  } catch (error) {
    logger.error(`Error syncing job description for job ${jobDescription.id}:`, { message: error.message, stack: error.stack });
  }
};

const syncAll = async () => {
  logger.info('Starting bulk synchronization for all users and job descriptions...');

  const users = await userRepository.findAll();
  for (const user of users) {
    // Not awaiting each one to allow them to run in parallel without blocking
    syncResume(user.id);
  }

  const jobDescriptions = await jobDescriptionRepository.findAll();
  for (const job of jobDescriptions) {
    syncJobDescription(job);
  }

  logger.info('Bulk synchronization process initiated for all items.');
};

const SyncService = {
  syncResume,
  syncJobDescription,
  syncAll,
};

module.exports = { SyncService };