const jobDescriptionRepository = require('./jobDescription.repository');
const { SyncService } = require('../ml/sync.service');
const { PineconeService, EmbeddingService } = require('../ml');
const userRepository = require('../user/user.repository');
const headingRepository = require('../resume/heading/heading.repository');

const getJobDescriptions = async () => {
  return jobDescriptionRepository.findAll();
};

const getJobDescriptionById = async (id) => {
  const jobDescription = await jobDescriptionRepository.findById(id);
  if (!jobDescription) {
    throw new Error('Job description not found.');
  }
  return jobDescription;
};

const addJobDescription = async ({ title, description, requirements }) => {
  const jobDescription = await jobDescriptionRepository.addJobDescription({ title, description, requirements });
  SyncService.syncJobDescription(jobDescription);
  return jobDescription;
};

const updateJobDescription = async (id, { title, description, requirements }) => {
  const jobDescription = await jobDescriptionRepository.updateJobDescription(id, { title, description, requirements });
  SyncService.syncJobDescription(jobDescription);
  return jobDescription;
};

const deleteJobDescription = async (id) => {
  // Optional: We could add logic here to delete the vector from Pinecone
  return jobDescriptionRepository.deleteJobDescription(id);
};

const matchJob = async (jobId, topN) => {
  const vectorId = `job-${jobId}`;
  let jobVector;

  const pineconeResult = await PineconeService.fetch(vectorId);
  
  if (pineconeResult.records[vectorId].values.length > 0) {
    jobVector = pineconeResult.records[vectorId].values;
  } else {
    // Resiliency: Job vector not found, generate it on-the-fly
    const jobDescription = await getJobDescriptionById(jobId);
    const jobText = `${jobDescription.title}\n${jobDescription.description}\n${jobDescription.requirements}`;
    jobVector = await EmbeddingService.generateEmbedding(jobText);
    // Also trigger a background sync to fix this for the future
    SyncService.syncJobDescription(jobDescription);
  }

  const queryResult = await PineconeService.query(jobVector, topN, { type: 'resume' });

  if (!queryResult.matches || queryResult.matches.length === 0) {
    return [];
  }

  const userIds = queryResult.matches.map(match => match.metadata.userId);
  const users = await userRepository.getUsersByIds(userIds);
  const headings = await headingRepository.getHeadingsByUserIds(userIds);

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const headingMap = headings.reduce((acc, heading) => {
    acc[heading.userId] = heading;
    return acc;
  }, {});

  return queryResult.matches.map(match => {
    const userId = match.metadata.userId;
    const user = userMap[userId];
    const heading = headingMap[userId];
    return {
      score: match.score,
      user: {
        id: userId,
        name: user ? user.name : (heading ? heading.name : 'N/A'),
        email: user ? user.email : (heading ? heading.email : 'N/A'),
        role: heading ? heading.role : 'N/A',
      }
    };
  });
};

module.exports = {
  getJobDescriptions,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  getJobDescriptionById,
  matchJob,
};