require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");

const indexName = "edu-vault-resumes";
const dimension = 768; // Gemini embedding dimension

const setupPinecone = async () => {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set in the .env file.");
  }

  const pinecone = new Pinecone();

  try {
    console.log("Checking for existing Pinecone index...");
    const existingIndexes = await pinecone.listIndexes();
    if (!existingIndexes.indexes.some((index) => index.name === indexName)) {
      console.log(`Index not found. Creating new index: ${indexName}`)
      await pinecone.createIndex({
        name: indexName,
        dimension: dimension,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log("Index created successfully.");
    } else {
      console.log("Index already exists.");
    }
  } catch (error) {
    console.error("Error setting up Pinecone index:", error);
  }
};

setupPinecone();

module.exports = { setupPinecone, indexName };
