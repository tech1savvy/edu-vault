const { pipeline } = require('@xenova/transformers');

class EmbeddingService {
  static instance = null;

  static async getInstance() {
    if (!this.instance) {
      this.instance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return this.instance;
  }

  static async generateEmbedding(text) {
    const generator = await this.getInstance();
    const result = await generator(text, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(result.data);
  }
}

module.exports = EmbeddingService;
