const repository = require('./applicationStage.repository');
const { JobApplication, DriveStage, JobDescription, User, Notification, Drive, ApplicationStage } = require('../../models');

const getStudentApplications = async (userId) => {
  const applications = await JobApplication.findAll({
    where: { userId },
    include: [
      { model: JobDescription, as: 'job' },
      { model: DriveStage, as: 'currentStage' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  const result = [];
  for (const app of applications) {
    const stageLog = await repository.findByApplication(app.id);
    const drive = app.job.driveId
      ? await Drive.findByPk(app.job.driveId, {
          include: [{ model: DriveStage, as: 'stages', order: [['sequenceOrder', 'ASC']] }]
        })
      : null;

    result.push({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.job?.title || 'Unknown',
      jobDescription: app.job,
      drive,
      currentStage: app.currentStage,
      status: app.status,
      appliedAt: app.appliedAt,
      stageLog
    });
  }
  return result;
};

const getDriveApplications = async (driveId) => {
  return await repository.findByDrive(driveId);
};

const moveToStage = async (applicationId, stageId, adminId) => {
  const application = await JobApplication.findByPk(applicationId);
  if (!application) throw new Error('Application not found');

  const stage = await DriveStage.findByPk(stageId);
  if (!stage) throw new Error('Stage not found');

  await application.update({ currentStageId: stageId, status: 'reviewed' });

  const stageLog = await repository.create({
    applicationId,
    stageId,
    status: 'pending',
    updatedBy: adminId
  });

  const userId = application.userId;
  await Notification.create({
    userId,
    title: 'Stage Update',
    message: `You have been moved to "${stage.name}" round.`,
    type: 'stage_update',
    relatedId: applicationId
  });

  return stageLog;
};

const updateStageStatus = async (applicationId, stageId, status, notes, adminId) => {
  const validStatuses = ['shortlisted', 'eliminated'];
  if (!validStatuses.includes(status)) throw new Error('Invalid status');

  const stageLog = await ApplicationStage.findOne({
    where: { applicationId, stageId },
    order: [['updatedAt', 'DESC']]
  });
  if (!stageLog) throw new Error('Stage log not found');

  await stageLog.update({ status, notes, updatedBy: adminId, updatedAt: new Date() });

  const application = await JobApplication.findByPk(applicationId);
  if (!application) throw new Error('Application not found');

  if (status === 'eliminated') {
    await application.update({ status: 'rejected' });
  }

  const stage = await DriveStage.findByPk(stageId);
  const stageName = stage ? stage.name : 'current';

  await Notification.create({
    userId: application.userId,
    title: status === 'shortlisted' ? 'Congratulations!' : 'Application Update',
    message: status === 'shortlisted'
      ? `You have been shortlisted from "${stageName}" round.`
      : `You have been eliminated after "${stageName}" round.`,
    type: status === 'shortlisted' ? 'selection' : 'elimination',
    relatedId: applicationId
  });

  if (status === 'shortlisted') {
    const nextStage = await DriveStage.findOne({
      where: { driveId: stage.driveId, sequenceOrder: stage.sequenceOrder + 1 }
    });
    if (nextStage) {
      await application.update({ currentStageId: nextStage.id });
      await repository.create({
        applicationId,
        stageId: nextStage.id,
        status: 'pending',
        updatedBy: adminId
      });
      await Notification.create({
        userId: application.userId,
        title: 'Moved to Next Round',
        message: `You have been moved to "${nextStage.name}" round.`,
        type: 'stage_update',
        relatedId: applicationId
      });
    }
  }

  return stageLog;
};

module.exports = {
  getStudentApplications,
  getDriveApplications,
  moveToStage,
  updateStageStatus
};
