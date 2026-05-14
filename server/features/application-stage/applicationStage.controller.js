const service = require('./applicationStage.service');

const getStudentApps = async (req, res) => {
  try {
    const applications = await service.getStudentApplications(req.user.userId);
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getDriveApps = async (req, res) => {
  try {
    const applications = await service.getDriveApplications(req.params.driveId);
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const moveToStage = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { stageId } = req.body;
    const result = await service.moveToStage(applicationId, stageId, req.user.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateStageStatus = async (req, res) => {
  try {
    const { applicationId, stageId } = req.params;
    const { status, notes } = req.body;
    const result = await service.updateStageStatus(applicationId, stageId, status, notes, req.user.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getStudentApps,
  getDriveApps,
  moveToStage,
  updateStageStatus
};
