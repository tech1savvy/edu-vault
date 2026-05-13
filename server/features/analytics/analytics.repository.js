const { User, JobDescription, MatchHistory, Heading } = require('../../models');
const { Sequelize } = require('sequelize');

const countUsers = async () => {
  return await User.count();
};

const countStudents = async () => {
  return await User.count({ where: { role: 'student' } });
};

const countAdmins = async () => {
  return await User.count({ where: { role: 'administrator' } });
};

const countActiveUsers = async () => {
  return await User.count({ where: { status: 'active' } });
};

const countJobs = async () => {
  return await JobDescription.count();
};

const countMatchHistory = async () => {
  return await MatchHistory.count();
};

const getAverageMatchScore = async () => {
  const result = await MatchHistory.findOne({
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('match_score')), 'avgScore']
    ]
  });
  return result ? parseFloat(result.dataValues.avgScore) || 0 : 0;
};

const getTopSkills = async (limit = 10) => {
  const { Skill } = require('../../models');
  const skills = await Skill.findAll({
    attributes: [
      'name',
      [Sequelize.fn('COUNT', Sequelize.col('name')), 'count']
    ],
    group: ['name'],
    order: [[Sequelize.literal('count'), 'DESC']],
    limit
  });
  return skills.map(s => ({ name: s.name, count: parseInt(s.dataValues.count) }));
};

const getMatchHistoryByJob = async (jobId) => {
  return await MatchHistory.findAll({
    where: { jobId },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
    ],
    order: [['matchScore', 'DESC']],
    limit: 20
  });
};

const getMatchHistoryByUser = async (userId) => {
  return await MatchHistory.findAll({
    where: { userId },
    include: [
      { model: JobDescription, as: 'job', attributes: ['id', 'title'] }
    ],
    order: [['matchScore', 'DESC']]
  });
};

const createMatchHistory = async (jobId, userId, matchScore) => {
  return await MatchHistory.create({
    jobId,
    userId,
    matchScore,
    matchedAt: new Date()
  });
};

const getUserResumeCompletion = async (userId) => {
  const heading = await Heading.findOne({ where: { userId } });
  const { Experience, Education, Project, Skill, Certification, Achievement } = require('../../models');
  
  const counts = await Promise.all([
    Experience.count({ where: { userId } }),
    Education.count({ where: { userId } }),
    Project.count({ where: { userId } }),
    Skill.count({ where: { userId } }),
    Certification.count({ where: { userId } }),
    Achievement.count({ where: { userId } })
  ]);

  const completed = [
    heading ? 1 : 0,
    counts[0] > 0 ? 1 : 0,
    counts[1] > 0 ? 1 : 0,
    counts[2] > 0 ? 1 : 0,
    counts[3] > 0 ? 1 : 0,
    counts[4] > 0 ? 1 : 0,
    counts[5] > 0 ? 1 : 0
  ].filter(Boolean).length;

  return {
    total: 7,
    completed,
    percentage: Math.round((completed / 7) * 100)
  };
};

const getAverageResumeCompletion = async () => {
  const users = await User.findAll({ where: { role: 'student' } });
  if (users.length === 0) return 0;

  let totalCompletion = 0;
  for (const user of users) {
    const completion = await getUserResumeCompletion(user.id);
    totalCompletion += completion.percentage;
  }

  return Math.round(totalCompletion / users.length);
};

const getReadinessDistribution = async () => {
  const { Heading, Experience, Education, Project, Skill, Certification, Achievement } = require('../../models');

  const students = await User.findAll({
    where: { role: 'student' },
    attributes: ['id']
  });

  if (students.length === 0) {
    return { atRisk: 0, moderate: 0, ready: 0 };
  }

  const userIds = students.map(s => s.id);

  const [headings, experiences, educations, projects, skills, certifications, achievements] = await Promise.all([
    Heading.findAll({ where: { userId: userIds }, attributes: ['userId'], raw: true }),
    Experience.findAll({ where: { userId: userIds }, attributes: ['userId'], raw: true }),
    Education.findAll({ where: { userId: userIds }, attributes: ['userId'], raw: true }),
    Project.findAll({ where: { userId: userIds }, attributes: ['userId'], raw: true }),
    Skill.findAll({ where: { userId: userIds }, attributes: ['userId'], raw: true }),
    Certification.findAll({ where: { userId: userIds }, attributes: ['userId'], raw: true }),
    Achievement.findAll({ where: { userId: userIds }, attributes: ['userId'], raw: true })
  ]);

  const headingSet = new Set(headings.map(h => h.userId));
  const expSet = new Set(experiences.map(e => e.userId));
  const eduSet = new Set(educations.map(e => e.userId));
  const projSet = new Set(projects.map(p => p.userId));
  const skillSet = new Set(skills.map(s => s.userId));
  const certSet = new Set(certifications.map(c => c.userId));
  const achSet = new Set(achievements.map(a => a.userId));

  let atRisk = 0, moderate = 0, ready = 0;

  for (const userId of userIds) {
    const completed = [
      headingSet.has(userId),
      expSet.has(userId),
      eduSet.has(userId),
      projSet.has(userId),
      skillSet.has(userId),
      certSet.has(userId),
      achSet.has(userId)
    ].filter(Boolean).length;

    const pct = Math.round((completed / 7) * 100);

    if (pct < 40) atRisk++;
    else if (pct < 70) moderate++;
    else ready++;
  }

  return { atRisk, moderate, ready };
};

const getRoleDistribution = async () => {
  const jobs = await JobDescription.findAll({
    attributes: ['title'],
    raw: true
  });

  const roleCount = {};
  for (const job of jobs) {
    const role = job.title.split(' at ')[0].trim();
    roleCount[role] = (roleCount[role] || 0) + 1;
  }

  return Object.entries(roleCount).map(([name, value]) => ({ name, value }));
};

module.exports = {
  countUsers,
  countStudents,
  countAdmins,
  countActiveUsers,
  countJobs,
  countMatchHistory,
  getAverageMatchScore,
  getTopSkills,
  getMatchHistoryByJob,
  getMatchHistoryByUser,
  createMatchHistory,
  getUserResumeCompletion,
  getAverageResumeCompletion,
  getReadinessDistribution,
  getRoleDistribution
};
