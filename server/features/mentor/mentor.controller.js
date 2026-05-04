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
    const { studentId, taskName, deadline, priority } = req.body;
    
    if (!studentId || !taskName) {
        return res.status(400).json({ success: false, error: 'studentId and taskName are required' });
    }

    const actionData = {
        studentId,
        mentorId: req.user.userId,
        taskName,
        deadline: deadline || null,
        priority: priority || 'MEDIUM',
        status: 'pending'
    };

    const newAction = await mentorService.addMentoringAction(actionData);
    res.status(201).json({ success: true, data: newAction });
});

const updateMentorAction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, priority, studentNote, mentorFeedback } = req.body;

    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;
    if (priority) dataToUpdate.priority = priority;
    if (studentNote !== undefined) dataToUpdate.studentNote = studentNote;
    if (mentorFeedback !== undefined) dataToUpdate.mentorFeedback = mentorFeedback;

    const updated = await mentorService.updateMentoringAction(id, dataToUpdate);
    res.json({ success: true, data: updated[1][0] }); // returning true makes index 1 the array of updated rows
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
    updateMentorAction,
    getMentoringTimeline
};
