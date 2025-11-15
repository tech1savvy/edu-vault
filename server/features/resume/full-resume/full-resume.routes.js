const express = require('express');
const router = express.Router();
const { getFullResume } = require('./full-resume.controller');

router.get('/', getFullResume);

module.exports = router;
