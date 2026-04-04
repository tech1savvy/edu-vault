const repository = require('./jobApplications.repository');

const getApplicationsByJob = async (jobId) => {
  const applications = await repository.findByJobId(jobId);
  return applications.map(app => ({
    id: app.id,
    userId: app.userId,
    userName: app.user?.name || 'Unknown',
    userEmail: app.user?.email || '',
    status: app.status,
    notes: app.notes,
    appliedAt: app.appliedAt
  }));
};

const getApplicationsByUser = async (userId) => {
  const applications = await repository.findByUserId(userId);
  return applications.map(app => ({
    id: app.id,
    jobId: app.jobId,
    jobTitle: app.job?.title || 'Unknown',
    status: app.status,
    notes: app.notes,
    appliedAt: app.appliedAt
  }));
};

const applyToJob = async (jobId, userId) => {
  const hasApplied = await repository.hasApplied(jobId, userId);
  if (hasApplied) {
    throw new Error('You have already applied to this job');
  }
  return await repository.create(jobId, userId);
};

const updateApplicationStatus = async (applicationId, status, notes = null) => {
  const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }
  return await repository.updateStatus(applicationId, status, notes);
};

const getApplicationCounts = async (jobId) => {
  const counts = await repository.countByStatus(jobId);
  const result = {
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0
  };
  
  for (const item of counts) {
    result[item.status] = parseInt(item.dataValues.count);
    result.total += parseInt(item.dataValues.count);
  }
  
  return result;
};

module.exports = {
  getApplicationsByJob,
  getApplicationsByUser,
  applyToJob,
  updateApplicationStatus,
  getApplicationCounts
};
