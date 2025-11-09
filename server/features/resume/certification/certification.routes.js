const express = require('express');
const router = express.Router();
const {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} = require('./certification.controller');
const authenticateToken = require('../../../middleware/auth');
const authorizeRoles = require('../../../middleware/roles');

router.get('/', authenticateToken, getCertifications);
router.post('/', authenticateToken, authorizeRoles('student'), addCertification);
router.put('/:id', authenticateToken, authorizeRoles('student'), updateCertification);
router.delete('/:id', authenticateToken, authorizeRoles('student'), deleteCertification);

module.exports = router;
