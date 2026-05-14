const service = require('./notification.service');

const getAll = async (req, res) => {
  try {
    const notifications = await service.getNotifications(req.user.userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await service.getUnreadCount(req.user.userId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notification = await service.markAsRead(req.params.id, req.user.userId);
    res.json({ success: true, data: notification });
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    await service.deleteNotification(req.params.id, req.user.userId);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAll, getUnreadCount, markRead, destroy
};
