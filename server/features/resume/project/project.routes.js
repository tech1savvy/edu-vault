const express = require('express');
const router = express.Router();
const {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} = require('./project.controller');
const authenticateToken = require('../../../middleware/auth');
const authorizeRoles = require('../../../middleware/roles');

router.get('/', authenticateToken, getProjects);
router.post('/', authenticateToken, authorizeRoles('student'), addProject);
router.put('/:id', authenticateToken, authorizeRoles('student'), updateProject);
router.delete('/:id', authenticateToken, authorizeRoles('student'), deleteProject);

module.exports = router;