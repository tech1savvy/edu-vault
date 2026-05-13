const express = require('express');
const router = express.Router();
const { getStudentPublicResume } = require('./public.controller');

router.get('/students/:userId/resume', getStudentPublicResume);

module.exports = router;
