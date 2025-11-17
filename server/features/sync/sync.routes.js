const express = require('express');
const router = express.Router();
const syncController = require('./sync.controller');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

router.post('/all', authenticateToken, authorizeRoles('administrator'), syncController.syncAll);

module.exports = router;
