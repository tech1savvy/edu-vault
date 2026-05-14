const { Notification } = require('../../models');

const findByUser = async (userId) => {
  return await Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
};

const findUnreadCount = async (userId) => {
  return await Notification.count({
    where: { userId, isRead: false }
  });
};

const create = async (data) => {
  return await Notification.create(data);
};

const markAsRead = async (id, userId) => {
  const notification = await Notification.findOne({ where: { id, userId } });
  if (!notification) throw new Error('Notification not found');
  return await notification.update({ isRead: true });
};

const destroy = async (id, userId) => {
  const notification = await Notification.findOne({ where: { id, userId } });
  if (!notification) throw new Error('Notification not found');
  return await notification.destroy();
};

module.exports = {
  findByUser,
  findUnreadCount,
  create,
  markAsRead,
  destroy
};
