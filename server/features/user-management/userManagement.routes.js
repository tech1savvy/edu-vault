const express = require('express');
const router = express.Router();
const controller = require('./userManagement.controller');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

router.get('/', authenticateToken, authorizeRoles('administrator'), controller.getAll);
router.get('/:id', authenticateToken, authorizeRoles('administrator'), controller.getById);
router.put('/:id/role', authenticateToken, authorizeRoles('administrator'), controller.updateRole);
router.put('/:id/status', authenticateToken, authorizeRoles('administrator'), controller.updateStatus);

module.exports = router;
