const express = require('express');
const router = express.Router();
const controller = require('./drive.controller');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

router.get('/', authenticateToken, controller.getAll);
router.get('/:id', authenticateToken, controller.getById);
router.get('/:id/stats', authenticateToken, controller.getStats);
router.post('/', authenticateToken, authorizeRoles('administrator'), controller.create);
router.put('/:id', authenticateToken, authorizeRoles('administrator'), controller.update);
router.put('/:id/status', authenticateToken, authorizeRoles('administrator'), controller.updateStatus);
router.delete('/:id', authenticateToken, authorizeRoles('administrator'), controller.destroy);

module.exports = router;
