const { User } = require('../../models');

const findAll = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await User.findAndCountAll({
    where: { role: 'student' },
    attributes: ['id', 'name', 'email', 'role', 'status', 'lastLogin', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  return {
    users: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'role', 'status', 'lastLogin', 'createdAt', 'updatedAt']
  });
};

const updateRole = async (id, role) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  return await user.update({ role });
};

const updateStatus = async (id, status) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  return await user.update({ status });
};

const updateLastLogin = async (id) => {
  await User.update({ lastLogin: new Date() }, { where: { id } });
};

module.exports = { findAll, findById, updateRole, updateStatus, updateLastLogin };
