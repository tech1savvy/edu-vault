const { Pinecone } = require('@pinecone-database/pinecone');
const config = require('../../config/config');
const logger = require('../../config/logger');

const indexName = 'eduvault-resumes';
const dimension = 384; // Dimension for Xenova/all-MiniLM-L6-v2

class PineconeService {
  static pinecone = null;
  static index = null;

  static async init() {
    if (this.pinecone) {
      return;
    }

    try {
      this.pinecone = new Pinecone({
        apiKey: config.pinecone.apiKey,
      });

      const existingIndexes = await this.pinecone.listIndexes();
      if (!existingIndexes.indexes || !existingIndexes.indexes.some(index => index.name === indexName)) {
        throw new Error(`Pinecone index '${indexName}' not found. Please create it manually in your Pinecone dashboard.`);
      }

      this.index = this.pinecone.index(indexName);
      logger.info(`Successfully connected to Pinecone index '${indexName}'.`);
    } catch (error) {
      logger.error('Error initializing Pinecone:', error);
      throw new Error('Could not initialize Pinecone service.');
    }
  }

  static async getInstance() {
    if (!this.index) {
      await this.init();
    }
    return this.index;
  }

  static async upsert(vectors) {
    const index = await this.getInstance();
    return index.upsert(vectors);
  }

  static async fetch(id) {
    const index = await this.getInstance();
    return index.fetch([id]);
  }

  static async query(vector, topK, filter) {
    const index = await this.getInstance();
    return index.query({
      vector,
      topK,
      filter,
      includeMetadata: true,
    });
  }
}

module.exports = PineconeService;
