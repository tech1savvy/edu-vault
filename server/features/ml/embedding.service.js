class EmbeddingService {
  static instance = null;
  static pipeline = null;

  static async loadPipeline() {
    if (!this.pipeline) {
      // ESM-only package → dynamic import (Node 18+ safe)
      const { pipeline } = await import('@xenova/transformers');
      this.pipeline = pipeline;
    }
    return this.pipeline;
  }

  static async getInstance() {
    if (!this.instance) {
      const pipeline = await this.loadPipeline();
      this.instance = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
    }
    return this.instance;
  }

  static async generateEmbedding(text) {
    if (!text) return [];

    const generator = await this.getInstance();
    const result = await generator(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(result.data);
  }
}

module.exports = EmbeddingService;
