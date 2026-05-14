const express = require('express');
const router = express.Router();
const controller = require('./notification.controller');
const authenticateToken = require('../../middleware/auth');

router.get('/', authenticateToken, controller.getAll);
router.get('/unread-count', authenticateToken, controller.getUnreadCount);
router.put('/:id/read', authenticateToken, controller.markRead);
router.delete('/:id', authenticateToken, controller.destroy);

module.exports = router;
