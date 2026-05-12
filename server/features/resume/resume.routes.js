const express = require('express');
const router = express.Router();
const { getFullResume } = require('./resume.controller');
const authenticateToken = require('../../middleware/auth');

router.get('/all', authenticateToken, getFullResume);

module.exports = router;
