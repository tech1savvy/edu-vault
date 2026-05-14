const repository = require('./drive.repository');
const stageRepository = require('./driveStage.repository');
const { JobApplication, ApplicationStage, DriveStage, JobDescription, Education, Skill, User, Sequelize, sequelize } = require('../../models');

const getDrives = async (user) => {
  const drives = await repository.findAll();

  if (user.role === 'administrator') {
    return drives;
  }

  const userId = user.userId;
  const userEducations = await Education.findAll({ where: { userId } });
  const userSkills = await Skill.findAll({ where: { userId } });
  const userSkillNames = userSkills.map(s => s.name.toLowerCase());

  return drives.filter(drive => {
    if (drive.status === 'closed') return false;

    const eligibleJobs = drive.jobDescriptions.filter(job => isJobEligible(job, userEducations, userSkillNames));
    return eligibleJobs.length > 0;
  }).map(drive => {
    const eligibleJobs = drive.jobDescriptions.filter(job =>
      isJobEligible(job, userEducations, userSkillNames)
    );
    return { ...drive.toJSON(), jobDescriptions: eligibleJobs };
  });
};

const isJobEligible = (job, userEducations, userSkillNames) => {
  if (job.status !== 'active') return false;
  if (job.minCgpa) {
    const maxCgpa = Math.max(...userEducations.map(e => parseFloat(e.cgpa || 0)));
    if (maxCgpa < job.minCgpa) return false;
  }
  if (job.requiredSkills && job.requiredSkills.length > 0) {
    const required = job.requiredSkills.map(s => s.toLowerCase());
    const hasAll = required.every(s => userSkillNames.includes(s));
    if (!hasAll) return false;
  }
  if (job.eligibleBranches && job.eligibleBranches.length > 0) {
    const userBranches = userEducations.map(e => (e.fieldOfStudy || '').toLowerCase());
    const matchesBranch = job.eligibleBranches.some(b => userBranches.includes(b.toLowerCase()));
    if (!matchesBranch) return false;
  }
  return true;
};

const getDriveById = async (id, user) => {
  const drive = await repository.findById(id);
  if (!drive) throw new Error('Drive not found');
  return drive;
};

const createDrive = async (data, adminId) => {
  const { stages, ...driveData } = data;
  const drive = await repository.create({ ...driveData, createdBy: adminId });
  if (stages && stages.length > 0) {
    for (let i = 0; i < stages.length; i++) {
      await stageRepository.create({
        driveId: drive.id,
        name: stages[i].name,
        sequenceOrder: i + 1,
        scheduledDate: stages[i].scheduledDate || null,
        description: stages[i].description || null,
        stageType: stages[i].stageType || 'custom'
      });
    }
  }
  return await repository.findById(drive.id);
};

const updateDrive = async (id, data) => {
  const { stages, ...driveData } = data;
  const drive = await repository.update(id, driveData);
  if (stages) {
    await stageRepository.deleteByDrive(id);
    for (let i = 0; i < stages.length; i++) {
      await stageRepository.create({
        driveId: id,
        name: stages[i].name,
        sequenceOrder: i + 1,
        scheduledDate: stages[i].scheduledDate || null,
        description: stages[i].description || null,
        stageType: stages[i].stageType || 'custom'
      });
    }
  }
  return await repository.findById(id);
};

const deleteDrive = async (id) => {
  await stageRepository.deleteByDrive(id);
  return await repository.destroy(id);
};

const updateDriveStatus = async (id, status) => {
  return await repository.update(id, { status });
};

const getDriveStats = async (driveId) => {
  const jobs = await JobDescription.findAll({ where: { driveId } });
  const jobIds = jobs.map(j => j.id);
  if (jobIds.length === 0) return { stages: [] };

  const stages = await DriveStage.findAll({
    where: { driveId },
    order: [['sequenceOrder', 'ASC']]
  });

  const totalApplied = await JobApplication.count({
    where: { jobId: jobIds }
  });

  const stageStats = await Promise.all(stages.map(async (stage) => {
    const count = await JobApplication.count({
      where: { jobId: jobIds, currentStageId: stage.id }
    });
    return {
      stageId: stage.id,
      stageName: stage.name,
      sequenceOrder: stage.sequenceOrder,
      scheduledDate: stage.scheduledDate,
      count
    };
  }));

  const stageLogCounts = await sequelize.query(`
    SELECT "ApplicationStage"."stage_id" AS "stageId",
           "ApplicationStage"."status",
           COUNT("ApplicationStage"."id") AS "count"
    FROM "ApplicationStages" AS "ApplicationStage"
    INNER JOIN "JobApplications" AS "application"
      ON "ApplicationStage"."application_id" = "application"."id"
    WHERE "application"."job_id" IN (${jobIds.join(',')})
    GROUP BY "ApplicationStage"."stage_id", "ApplicationStage"."status"
  `, { type: Sequelize.QueryTypes.SELECT });

  const eliminatedCount = stageLogCounts
    .filter(l => l.status === 'eliminated')
    .reduce((sum, l) => sum + parseInt(l.count), 0);

  const selectedCount = stageLogCounts
    .filter(l => l.status === 'shortlisted')
    .reduce((sum, l) => sum + parseInt(l.count), 0);

  return {
    totalApplied,
    eliminated: eliminatedCount,
    selected: selectedCount,
    stages: stageStats
  };
};

module.exports = {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  updateDriveStatus,
  getDriveStats
};
