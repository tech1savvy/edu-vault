const repository = require('./userManagement.repository');

const getAllUsers = async (page = 1, limit = 20) => {
  return repository.findAll(page, limit);
};

const getUserById = async (id) => {
  const user = await repository.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};

const updateUserRole = async (targetUserId, newRole, requestingAdminId) => {
  const targetId = parseInt(targetUserId);
  const adminId = parseInt(requestingAdminId);

  if (targetId === adminId) {
    throw new Error('Cannot modify your own role');
  }

  const targetUser = await repository.findById(targetId);
  if (!targetUser) throw new Error('User not found');

  if (targetUser.role === 'administrator') {
    throw new Error('Cannot modify another administrator\'s role');
  }

  if (newRole !== 'student') {
    throw new Error('Invalid role. Only student role can be assigned');
  }

  return repository.updateRole(targetId, newRole);
};

const updateUserStatus = async (targetUserId, newStatus, requestingAdminId) => {
  const targetId = parseInt(targetUserId);
  const adminId = parseInt(requestingAdminId);

  if (targetId === adminId) {
    throw new Error('Cannot modify your own status');
  }

  const targetUser = await repository.findById(targetId);
  if (!targetUser) throw new Error('User not found');

  if (targetUser.role === 'administrator') {
    throw new Error('Cannot modify another administrator\'s status');
  }

  const validStatuses = ['active', 'inactive', 'suspended'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid status');
  }

  return repository.updateStatus(targetId, newStatus);
};

module.exports = { getAllUsers, getUserById, updateUserRole, updateUserStatus };
