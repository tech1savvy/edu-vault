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
  console.log("Chunking resume data...");
  const chunks = [];

  // Heading
  if (resumeData.heading) {
    const { fullName, title, description, ...rest } = resumeData.heading;
    chunks.push(`The candidate's name is ${fullName}. They are a ${title}. ${description}`);
  }

  // Experiences
  if (resumeData.experiences && resumeData.experiences.length > 0) {
    resumeData.experiences.forEach(exp => {
      chunks.push(`Worked as a ${exp.role} at ${exp.company} from ${exp.duration}. Responsibilities included: ${exp.details}. This was a ${exp.type} position.`);
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    resumeData.education.forEach(edu => {
      chunks.push(`Studied ${edu.degree} at ${edu.college} from ${edu.startDate} to ${edu.endDate}. Achieved a score of ${edu.score}.`);
    });
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    resumeData.projects.forEach(proj => {
      chunks.push(`Worked on a project titled "${proj.title}". The tech stack included ${proj.techStack}. The project timeline was ${proj.timeline}. Description: ${proj.description}`);
    });
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    chunks.push(`The candidate has skills in the following areas: ${resumeData.skills.join(", ")}.`);
  }

  // Achievements
  if (resumeData.achievements && resumeData.achievements.length > 0) {
    resumeData.achievements.forEach(ach => {
      chunks.push(`Achievement: ${ach.title}, awarded on ${ach.date}. Description: ${ach.description}`);
    });
  }

  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    resumeData.certifications.forEach(cert => {
      chunks.push(`Certified in ${cert.name} by ${cert.issuer}, obtained on ${cert.date}.`);
    });
  }

  console.log(`Created ${chunks.length} chunks.`);
  return chunks.filter(chunk => chunk); // Filter out any empty or null chunks
};

/**
 * Generates an embedding for a given text chunk.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} The embedding vector.
 */
const getEmbedding = async (text) => {
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
