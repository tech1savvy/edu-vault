const { JobDescription } = require('../../models');

const findAll = async () => {
  return await JobDescription.findAll();
};

const findById = async (id) => {
  return await JobDescription.findByPk(id);
};

const addJobDescription = async ({ title, description, requirements }) => {
  return await JobDescription.create({ title, description, requirements });
};

const updateJobDescription = async (id, { title, description, requirements }) => {
  const jobDescription = await JobDescription.findByPk(id);
  if (!jobDescription) {
    throw new Error('Job Description not found');
  }
  return await jobDescription.update({ title, description, requirements });
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