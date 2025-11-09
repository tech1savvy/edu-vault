const express = require('express');
const router = express.Router();
const {
  getHeading,
  createOrUpdateHeading,
} = require('./heading.controller');
const authenticateToken = require('../../../middleware/auth');
const authorizeRoles = require('../../../middleware/roles');

router.get('/', authenticateToken, getHeading);
router.post('/', authenticateToken, authorizeRoles('student'), createOrUpdateHeading);

module.exports = router;
