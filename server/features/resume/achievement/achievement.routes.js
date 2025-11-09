const express = require('express');
const router = express.Router();
const {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} = require('./achievement.controller');
const authenticateToken = require('../../../middleware/auth');
const authorizeRoles = require('../../../middleware/roles');

router.get('/', authenticateToken, getAchievements);
router.post('/', authenticateToken, authorizeRoles('student'), addAchievement);
router.put('/:id', authenticateToken, authorizeRoles('student'), updateAchievement);
router.delete('/:id', authenticateToken, authorizeRoles('student'), deleteAchievement);

module.exports = router;
