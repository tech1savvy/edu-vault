const repository = require('./notification.repository');

const getNotifications = async (userId) => {
  return await repository.findByUser(userId);
};

const getUnreadCount = async (userId) => {
  return await repository.findUnreadCount(userId);
};

const markAsRead = async (id, userId) => {
  return await repository.markAsRead(id, userId);
};

const deleteNotification = async (id, userId) => {
  return await repository.destroy(id, userId);
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification
};
