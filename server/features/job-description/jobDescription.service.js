const jobDescriptionRepository = require('./jobDescription.repository');

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
  return jobDescriptionRepository.addJobDescription({ title, description, requirements });
};

const updateJobDescription = async (id, { title, description, requirements }) => {
  return jobDescriptionRepository.updateJobDescription(id, { title, description, requirements });
};

const deleteJobDescription = async (id) => {
  return jobDescriptionRepository.deleteJobDescription(id);
};

module.exports = {
  getJobDescriptions,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  getJobDescriptionById,
};