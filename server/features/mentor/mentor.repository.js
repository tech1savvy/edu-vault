const { User, MentorAction, Skill, Project, Education, JobDescription } = require('../../models');

const getAllStudents = async () => {
  return await User.findAll({
    where: { role: 'student' },
    attributes: ['id', 'name', 'email', 'status', 'lastLogin']
  });
};

const getStudentById = async (id) => {
  return await User.findOne({
    where: { id, role: 'student' },
    attributes: ['id', 'name', 'email', 'status', 'lastLogin']
  });
};

const getStudentSkills = async (userId) => {
  return await Skill.findAll({ where: { userId } });
};

const getStudentProjects = async (userId) => {
  return await Project.findAll({ where: { userId } });
};

const getStudentEducation = async (userId) => {
  return await Education.findAll({ where: { userId } });
};

const getStudentCertifications = async (userId) => {
  const { Certification } = require('../../models');
  if (!Certification) return []; // Fallback if not loaded
  return await Certification.findAll({ where: { userId } });
};

const getJobDescriptions = async () => {
    return await JobDescription.findAll({
        where: { status: 'active' },
        attributes: ['id', 'title', 'description', 'requirements']
    });
}

const getMentorActions = async (studentId) => {
  return await MentorAction.findAll({
    where: { studentId },
    order: [['createdAt', 'DESC']],
    include: [
        { model: User, as: 'mentor', attributes: ['id', 'name'] }
    ]
  });
};

const createMentorAction = async (data) => {
  return await MentorAction.create(data);
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentSkills,
  getStudentProjects,
  getStudentEducation,
  getStudentCertifications,
  getJobDescriptions,
  getMentorActions,
  createMentorAction
};
