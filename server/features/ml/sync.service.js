
import { getAggregatedResumeText } from '../resume/resume.aggregator';
import { EmbeddingService, PineconeService } from './';
import logger from '../../config/logger';

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

export const SyncService = {
  syncResume,
  syncJobDescription,
};
