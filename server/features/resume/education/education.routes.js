const express = require('express');
const router = express.Router();
const {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
} = require('./education.controller');
const authenticateToken = require('../../../middleware/auth');
const authorizeRoles = require('../../../middleware/roles');

router.get('/', authenticateToken, getEducations);
router.post('/', authenticateToken, authorizeRoles('student'), addEducation);
router.put('/:id', authenticateToken, authorizeRoles('student'), updateEducation);
router.delete('/:id', authenticateToken, authorizeRoles('student'), deleteEducation);

module.exports = router;
