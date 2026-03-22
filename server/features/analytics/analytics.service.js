const repository = require('./analytics.repository');

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalStudents,
    totalAdmins,
    activeUsers,
    totalJobs,
    totalMatches,
    avgMatchScore,
    avgCompletion
  ] = await Promise.all([
    repository.countUsers(),
    repository.countStudents(),
    repository.countAdmins(),
    repository.countActiveUsers(),
    repository.countJobs(),
    repository.countMatchHistory(),
    repository.getAverageMatchScore(),
    repository.getAverageResumeCompletion()
  ]);

  return {
    totalUsers,
    totalStudents,
    totalAdmins,
    activeUsers,
    totalJobs,
    totalMatches,
    avgMatchScore: avgMatchScore.toFixed(2),
    avgResumeCompletion: avgCompletion
  };
};

const getUserStats = async () => {
  const [total, students, admins, active] = await Promise.all([
    repository.countUsers(),
    repository.countStudents(),
    repository.countAdmins(),
    repository.countActiveUsers()
  ]);

  return {
    total,
    students,
    admins,
    active,
    inactive: total - active
  };
};

const getJobStats = async () => {
  const total = await repository.countJobs();
  return { total };
};

const getMatchStats = async () => {
  const [total, avgScore] = await Promise.all([
    repository.countMatchHistory(),
    repository.getAverageMatchScore()
  ]);

  return {
    total,
    avgScore: avgScore.toFixed(2)
  };
};

const getTopSkills = async (limit = 10) => {
  return await repository.getTopSkills(limit);
};

const recordMatch = async (jobId, userId, matchScore) => {
  return await repository.createMatchHistory(jobId, userId, matchScore);
};

const getMatchHistoryForJob = async (jobId) => {
  const history = await repository.getMatchHistoryByJob(jobId);
  return history.map(h => ({
    userId: h.userId,
    userName: h.user?.name || 'Unknown',
    userEmail: h.user?.email || '',
    matchScore: h.matchScore,
    matchedAt: h.matchedAt
  }));
};

const getMatchHistoryForUser = async (userId) => {
  const history = await repository.getMatchHistoryByUser(userId);
  return history.map(h => ({
    jobId: h.jobId,
    jobTitle: h.job?.title || 'Unknown',
    matchScore: h.matchScore,
    matchedAt: h.matchedAt
  }));
};

module.exports = {
  getDashboardStats,
  getUserStats,
  getJobStats,
  getMatchStats,
  getTopSkills,
  recordMatch,
  getMatchHistoryForJob,
  getMatchHistoryForUser
};
