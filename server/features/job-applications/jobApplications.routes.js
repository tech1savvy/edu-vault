const express = require('express');
const router = express.Router();
const controller = require('./jobApplications.controller');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

router.get('/job/:jobId', authenticateToken, authorizeRoles('administrator'), controller.getByJob);
router.post('/job/:jobId/apply', authenticateToken, controller.apply);
router.put('/application/:applicationId/status', authenticateToken, authorizeRoles('administrator'), controller.updateStatus);
router.get('/job/:jobId/counts', authenticateToken, authorizeRoles('administrator'), controller.getCounts);

module.exports = router;
