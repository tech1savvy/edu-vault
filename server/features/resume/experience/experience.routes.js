const express = require('express');
const router = express.Router();
const {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} = require('./experience.controller');
const authenticateToken = require('../../../middleware/auth');
const authorizeRoles = require('../../../middleware/roles');

router.get('/', authenticateToken, getExperiences);
router.post('/', authenticateToken, authorizeRoles('student'), addExperience);
router.put('/:id', authenticateToken, authorizeRoles('student'), updateExperience);
router.delete('/:id', authenticateToken, authorizeRoles('student'), deleteExperience);

module.exports = router;
