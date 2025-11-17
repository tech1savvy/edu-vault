
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

export const SyncService = {
  syncResume,
};
