const express = require('express');
const router = express.Router();
const { handleProcessResume } = require('./process.handlers');

router.post('/resume', handleProcessResume);

module.exports = router;
