const express = require('express');
const router = express.Router();
const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} = require('./skill.controller');
const authenticateToken = require('../../../middleware/auth');
const authorizeRoles = require('../../../middleware/roles');

router.get('/', authenticateToken, getSkills);
router.post('/', authenticateToken, authorizeRoles('student'), addSkill);
router.put('/:id', authenticateToken, authorizeRoles('student'), updateSkill);
router.delete('/:id', authenticateToken, authorizeRoles('student'), deleteSkill);

module.exports = router;
