const { JobDescription } = require('../../models');

const findAll = async () => {
  return await JobDescription.findAll();
};

const findById = async (id) => {
  return await JobDescription.findByPk(id);
};

const addJobDescription = async (data) => {
  return await JobDescription.create(data);
};

const updateJobDescription = async (id, data) => {
  const jobDescription = await JobDescription.findByPk(id);
  if (!jobDescription) {
    throw new Error('Job Description not found');
  }
  return await jobDescription.update(data);
};

const deleteJobDescription = async (id) => {
  const jobDescription = await JobDescription.findByPk(id);
  if (!jobDescription) {
    throw new Error('Job Description not found');
  }
  return await jobDescription.destroy();
};

const findAllForSync = async () => {
  const jobs = await JobDescription.findAll();
  return jobs.map(j => ({
    id: j.id,
    text: `${j.title}\n${j.description}\n${j.requirements}`
  }));
};

module.exports = {
  findAll,
  findById,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  findAllForSync,
};