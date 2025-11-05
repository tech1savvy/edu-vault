const express = require('express');
const router = express.Router();
const {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} = require('./project.controller');

router.get('/', getProjects);
router.post('/', addProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;