const { JobApplication, User, JobDescription } = require('../../models');

const findByJobId = async (jobId) => {
  return await JobApplication.findAll({
    where: { jobId },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
    ],
    order: [['appliedAt', 'DESC']]
  });
};

const findByUserId = async (userId) => {
  return await JobApplication.findAll({
    where: { userId },
    include: [
      { model: JobDescription, as: 'job', attributes: ['id', 'title'] }
    ],
    order: [['appliedAt', 'DESC']]
  });
};

const findById = async (id) => {
  return await JobApplication.findByPk(id);
};

const create = async (jobId, userId) => {
  return await JobApplication.create({
    jobId,
    userId,
    status: 'pending',
    appliedAt: new Date()
  });
};

const updateStatus = async (id, status, notes = null) => {
  const application = await JobApplication.findByPk(id);
  if (!application) throw new Error('Application not found');
  
  const updateData = { status };
  if (notes !== null) updateData.notes = notes;
  
  return await application.update(updateData);
};

const hasApplied = async (jobId, userId) => {
  const application = await JobApplication.findOne({
    where: { jobId, userId }
  });
  return !!application;
};

const countByStatus = async (jobId) => {
  const { fn, col } = require('sequelize');
  const result = await JobApplication.findAll({
    where: { jobId },
    attributes: [
      'status',
      [fn('COUNT', col('status')), 'count']
    ],
    group: ['status']
  });
  return result;
};

module.exports = {
  findByJobId,
  findByUserId,
  findById,
  create,
  updateStatus,
  hasApplied,
  countByStatus
};
