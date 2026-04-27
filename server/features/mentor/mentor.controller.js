const mentorService = require('./mentor.service');
const { asyncHandler } = require('../../middleware');

const getStudents = asyncHandler(async (req, res) => {
    const students = await mentorService.getDashboardList();
    res.json({ success: true, data: students });
});

const getStudentDashboardData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { targetRole } = req.query;
    const dashboardData = await mentorService.getStudentDashboard(id, targetRole);
    res.json({ success: true, data: dashboardData });
});

const postMentorAction = asyncHandler(async (req, res) => {
    const { studentId, taskName, deadline } = req.body;
    
    if (!studentId || !taskName) {
        return res.status(400).json({ success: false, error: 'studentId and taskName are required' });
    }

    const actionData = {
        studentId,
        mentorId: req.user.id,
        taskName,
        deadline: deadline || null,
        status: 'pending'
    };

    const newAction = await mentorService.addMentoringAction(actionData);
    res.status(201).json({ success: true, data: newAction });
});

const getMentoringTimeline = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const timeline = await mentorService.getTimeline(studentId);
    res.json({ success: true, data: timeline });
});

module.exports = {
    getStudents,
    getStudentDashboardData,
    postMentorAction,
    getMentoringTimeline
};
