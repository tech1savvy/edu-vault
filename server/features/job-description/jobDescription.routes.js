const express = require('express');
const router = express.Router();
const {
  getJobDescriptions,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  getJobDescriptionById,
} = require('./jobDescription.controller');
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

router.get('/', authenticateToken, getJobDescriptions);
router.get('/:id', authenticateToken, getJobDescriptionById);
router.post('/', authenticateToken, authorizeRoles('administrator'), addJobDescription);
router.put('/:id', authenticateToken, authorizeRoles('administrator'), updateJobDescription);
router.delete('/:id', authenticateToken, authorizeRoles('administrator'), deleteJobDescription);

module.exports = router;
