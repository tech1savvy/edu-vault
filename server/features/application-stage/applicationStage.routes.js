const express = require('express');
const router = express.Router();
const controller = require('./applicationStage.controller');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

router.get('/student', authenticateToken, controller.getStudentApps);
router.get('/drive/:driveId', authenticateToken, authorizeRoles('administrator'), controller.getDriveApps);
router.post('/:applicationId/stage', authenticateToken, authorizeRoles('administrator'), controller.moveToStage);
router.put('/:applicationId/stage/:stageId', authenticateToken, authorizeRoles('administrator'), controller.updateStageStatus);

module.exports = router;
