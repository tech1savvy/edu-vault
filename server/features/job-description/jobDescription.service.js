const jobDescriptionRepository = require('./jobDescription.repository');
const { SyncService } = require('../ml/sync.service');
const mlClient = require('../ml/ml.client');
const userRepository = require('../user/user.repository');
const headingRepository = require('../resume/heading/heading.repository');
const analyticsService = require('../analytics/analytics.service');

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
  return jobDescriptionRepository.deleteJobDescription(id);
};

const matchJob = async (jobId, topN = 10) => {
  const jobDescription = await getJobDescriptionById(jobId);
  const jobText = `${jobDescription.title}\n${jobDescription.description}\n${jobDescription.requirements}`;

  const result = await mlClient.match(jobId, jobText, topN);

  if (!result.matches || result.matches.length === 0) {
    return [];
  }

  const userIds = result.matches.map((match) => match.user_id).filter(Boolean);
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

  const matches = result.matches.map((match) => {
    const userId = match.user_id;
    const user = userMap[userId];
    const heading = headingMap[userId];
    return {
      score: match.score,
      userId,
      user: {
        id: userId,
        name: user ? user.name : heading ? heading.name : "N/A",
        email: user ? user.email : heading ? heading.email : "N/A",
        role: heading ? heading.role : "N/A",
      },
    };
  });

  for (const match of matches) {
    try {
      await analyticsService.recordMatch(parseInt(jobId), match.userId, match.score);
    } catch (err) {
      console.error(`Failed to record match history for job ${jobId}, user ${match.userId}:`, err.message);
    }
  }

  return matches;
};

module.exports = {
  getJobDescriptions,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  getJobDescriptionById,
  matchJob,
};
