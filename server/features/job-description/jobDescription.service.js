const jobDescriptionRepository = require('./jobDescription.repository');
const { SyncService } = require('../ml/sync.service');

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

module.exports = {
  getJobDescriptions,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  getJobDescriptionById,
};