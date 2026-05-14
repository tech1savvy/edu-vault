const { ApplicationStage, JobApplication, DriveStage, JobDescription, User } = require('../../models');

const create = async (data) => {
  return await ApplicationStage.create(data);
};

const findByApplication = async (applicationId) => {
  return await ApplicationStage.findAll({
    where: { applicationId },
    include: [{ model: DriveStage, as: 'stage' }],
    order: [['updatedAt', 'ASC']]
  });
};

const findByDrive = async (driveId) => {
  const jobs = await JobDescription.findAll({ where: { driveId } });
  const jobIds = jobs.map(j => j.id);
  if (jobIds.length === 0) return [];

  const applications = await JobApplication.findAll({
    where: { jobId: jobIds },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: JobDescription, as: 'job', attributes: ['id', 'title'] },
      { model: DriveStage, as: 'currentStage' }
    ]
  });

  const appIds = applications.map(a => a.id);
  const stageLogs = await ApplicationStage.findAll({
    where: { applicationId: appIds },
    include: [{ model: DriveStage, as: 'stage' }],
    order: [['updatedAt', 'ASC']]
  });

  const stageMap = {};
  for (const log of stageLogs) {
    if (!stageMap[log.applicationId]) stageMap[log.applicationId] = [];
    stageMap[log.applicationId].push(log);
  }

  return applications.map(app => ({
    ...app.toJSON(),
    stageLog: stageMap[app.id] || []
  }));
};

const findLatestByApplication = async (applicationId) => {
  return await ApplicationStage.findOne({
    where: { applicationId },
    order: [['updatedAt', 'DESC']]
  });
};

module.exports = {
  create,
  findByApplication,
  findByDrive,
  findLatestByApplication
};
