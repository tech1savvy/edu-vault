const express = require('express');
const router = express.Router();
const mentorController = require('./mentor.controller');
const authenticate = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/roles');

// Only mentors and admins can access these routes
router.use(authenticate);
router.use(authorizeRoles('administrator', 'mentor'));

// 1. Get all students
router.get('/students', mentorController.getStudents);

// 2. Get student dashboard data
router.get('/students/:id', mentorController.getStudentDashboardData);

// 3. Add mentoring action
router.post('/actions', mentorController.postMentorAction);

// 4. Update mentoring action (status, feedback)
router.put('/actions/:id', mentorController.updateMentorAction);

// 5. Get timeline
router.get('/timeline/:studentId', mentorController.getMentoringTimeline);

module.exports = router;
