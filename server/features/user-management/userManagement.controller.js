const service = require('./userManagement.service');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await service.getAllUsers(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await service.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const requestingAdminId = req.user.userId;
    const result = await service.updateUserRole(req.params.id, role, requestingAdminId);
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestingAdminId = req.user.userId;
    const result = await service.updateUserStatus(req.params.id, status, requestingAdminId);
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = { getAll, getById, updateRole, updateStatus };
