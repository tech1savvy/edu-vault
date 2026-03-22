const express = require('express');
const router = express.Router();
const controller = require('./analytics.controller');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

router.get('/dashboard', authenticateToken, authorizeRoles('administrator'), controller.getDashboard);
router.get('/users', authenticateToken, authorizeRoles('administrator'), controller.getUserStats);
router.get('/jobs', authenticateToken, authorizeRoles('administrator'), controller.getJobStats);
router.get('/matches', authenticateToken, authorizeRoles('administrator'), controller.getMatchStats);
router.get('/skills', authenticateToken, authorizeRoles('administrator'), controller.getTopSkills);

module.exports = router;
