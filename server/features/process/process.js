require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { indexName } = require("../../utils/db/setupPinecone");

// Initialize clients
const pinecone = new Pinecone();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pineconeIndex = pinecone.index(indexName);

/**
 * Converts a resume JSON object into an array of text chunks.
 * @param {object} resumeData - The resume data.
 * @returns {string[]} An array of text chunks.
 */
const chunkResume = (resumeData) => {
  // Placeholder logic for chunking
  console.log("Chunking resume data...");
  const chunks = [];
  if (resumeData.heading) {
    chunks.push(JSON.stringify(resumeData.heading));
  }
  if (resumeData.experiences) {
    resumeData.experiences.forEach(exp => chunks.push(JSON.stringify(exp)));
  }
  // Add other sections similarly...
  console.log(`Created ${chunks.length} chunks.`);
  return chunks;
};

/**
 * Generates an embedding for a given text chunk.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} The embedding vector.
 */
const getEmbedding = async (text) => {
  // Placeholder logic for embedding
  console.log(`Generating embedding for: "${text.substring(0, 50)}..."`);
  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001"});
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
};

/**
 * Upserts the embeddings into the Pinecone index.
 * @param {string} userId - The user's ID.
 * @param {object[]} chunksWithEmbeddings - Array of objects with chunk text and embeddings.
 */
const upsertToPinecone = async (userId, chunksWithEmbeddings) => {
  // Placeholder logic for upserting
  console.log("Upserting embeddings to Pinecone...");
  const vectors = chunksWithEmbeddings.map((chunk, i) => ({
    id: `${userId}-chunk-${i}`,
    values: chunk.embedding,
    metadata: { userId: userId, text: chunk.text },
  }));

  // Pinecone recommends upserting in batches
  for (let i = 0; i < vectors.length; i += 100) {
    const batch = vectors.slice(i, i + 100);
    await pineconeIndex.upsert(batch);
  }
  console.log("Upsert complete.");
};

/**
 * Main function to orchestrate the embedding and storage process.
 * @param {string} userId - The user's ID.
 * @param {object} resumeData - The complete resume data.
 */
const embedAndStore = async (userId, resumeData) => {
  const chunks = chunkResume(resumeData);

  const chunksWithEmbeddings = [];
  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    chunksWithEmbeddings.push({ text: chunk, embedding });
  }

  await upsertToPinecone(userId, chunksWithEmbeddings);
};

module.exports = {
  embedAndStore,
};
