const service = require('./drive.service');

const getAll = async (req, res) => {
  try {
    const drives = await service.getDrives(req.user);
    res.json({ success: true, data: drives });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const drive = await service.getDriveById(req.params.id, req.user);
    res.json({ success: true, data: drive });
  } catch (error) {
    if (error.message === 'Drive not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const drive = await service.createDrive(req.body, req.user.userId);
    res.status(201).json({ success: true, data: drive });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const drive = await service.updateDrive(req.params.id, req.body);
    res.json({ success: true, data: drive });
  } catch (error) {
    if (error.message === 'Drive not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    await service.deleteDrive(req.params.id);
    res.json({ success: true, message: 'Drive deleted' });
  } catch (error) {
    if (error.message === 'Drive not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const drive = await service.updateDriveStatus(req.params.id, status);
    res.json({ success: true, data: drive });
  } catch (error) {
    if (error.message === 'Drive not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await service.getDriveStats(req.params.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAll, getById, create, update, destroy, updateStatus, getStats
};
